import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import University from "@/models/University";
import Country, { type ICountry } from "@/models/Country";
import type { CourseImportRow, BulkImportResult } from "@/types/education";

// Helper function to parse CSV with proper handling of quoted fields

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { courses }: { courses: CourseImportRow[] } = await request.json();

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { error: "No courses data provided" },
        { status: 400 }
      );
    }

    const result: BulkImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Helper function to get or create country
    const getOrCreateCountry = async (countryName: string) => {
      let country = await Country.findOne({ name: countryName });

      if (!country) {
        // Auto-create country with default values
        const countryCode = getCountryCode(countryName);
        const countryData = {
          name: countryName,
          code: countryCode,
          currency: getDefaultCurrency(countryName),
          language: "English",
          timezone: "UTC+0",
          flag: getCountryFlag(countryName),
          description: `Auto-created country: ${countryName}`,
        };

        country = new Country(countryData);
        await country.save();
        result.errors.push(`✅ Auto-created country: ${countryName}`);
      }

      return country;
    };

    // Helper function to get or create university
    const getOrCreateUniversity = async (
      universityName: string,
      country: ICountry
    ) => {
      let university = await University.findOne({
        name: universityName,
        countryId: country._id,
      });

      if (!university) {
        // Auto-create university with default values
        const universityData = {
          name: universityName,
          countryId: country._id,
          location: `${country.name}`,
          type: "Public" as const,
          description: `Auto-created university: ${universityName}`,
          website: generateWebsite(universityName),
          campusSize: "Not specified",
          studentPopulation: "Not specified",
          facilities: ["Library", "Student Center", "Sports Facilities"],
        };

        university = new University(universityData);
        await university.save();
        result.errors.push(
          `✅ Auto-created university: ${universityName} in ${country.name}`
        );
      }

      return university;
    };

    // Helper functions for default values
    const getCountryCode = (countryName: string): string => {
      const codes: Record<string, string> = {
        "United States": "US",
        "United Kingdom": "UK",
        Canada: "CA",
        Australia: "AU",
        Germany: "DE",
        France: "FR",
        Ireland: "IE",
        "New Zealand": "NZ",
        Netherlands: "NL",
        Switzerland: "CH",
      };
      return codes[countryName] || countryName.substring(0, 2).toUpperCase();
    };

    const getDefaultCurrency = (countryName: string): string => {
      const currencies: Record<string, string> = {
        "United States": "USD",
        "United Kingdom": "GBP",
        Canada: "CAD",
        Australia: "AUD",
        Germany: "EUR",
        France: "EUR",
        Ireland: "EUR",
        "New Zealand": "NZD",
        Netherlands: "EUR",
        Switzerland: "CHF",
      };
      return currencies[countryName] || "USD";
    };

    const getCountryFlag = (countryName: string): string => {
      const flags: Record<string, string> = {
        "United States": "🇺🇸",
        "United Kingdom": "🇬🇧",
        Canada: "🇨🇦",
        Australia: "🇦🇺",
        Germany: "🇩🇪",
        France: "🇫🇷",
        Ireland: "🇮🇪",
        "New Zealand": "🇳🇿",
        Netherlands: "🇳🇱",
        Switzerland: "🇨🇭",
      };
      return flags[countryName] || "🌍";
    };

    const generateWebsite = (universityName: string): string => {
      return (
        universityName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "")
          .substring(0, 20) + ".edu"
      );
    };

    for (let i = 0; i < courses.length; i++) {
      const row = courses[i];
      const rowNumber = i + 1;

      try {
        // Validate required fields
        if (!row.universityName || !row.countryName || !row.programName) {
          result.errors.push(
            `Row ${rowNumber}: Missing required fields (university, country, or program name)`
          );
          result.failed++;
          continue;
        }

        // Get or create country
        const country = await getOrCreateCountry(row.countryName);

        // Get or create university
        const university = await getOrCreateUniversity(
          row.universityName,
          country
        );

        // Parse numeric fields
        const ieltsScore = parseFloat(row.ieltsScore);
        const ieltsNoBandLessThan = parseFloat(row.ieltsNoBandLessThan);

        if (isNaN(ieltsScore) || isNaN(ieltsNoBandLessThan)) {
          result.errors.push(`Row ${rowNumber}: Invalid IELTS scores`);
          result.failed++;
          continue;
        }

        // Parse optional numeric fields
        const pteScore = row.pteScore ? parseFloat(row.pteScore) : undefined;
        const pteNoBandLessThan = row.pteNoBandLessThan
          ? parseFloat(row.pteNoBandLessThan)
          : undefined;
        const toeflScore = row.toeflScore
          ? parseFloat(row.toeflScore)
          : undefined;
        const duolingo = row.duolingo ? parseFloat(row.duolingo) : undefined;
        const gmatScore = row.gmatScore ? parseFloat(row.gmatScore) : undefined;
        const greScore = row.greScore ? parseFloat(row.greScore) : undefined;

        // Parse array fields
        const scholarships = row.scholarships
          ? row.scholarships
              .toString()
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const careerProspects = row.careerProspects
          ? row.careerProspects
              .toString()
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const accreditation = row.accreditation
          ? row.accreditation
              .toString()
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const specializations = row.specializations
          ? row.specializations
              .toString()
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        // Validate study level
        const validStudyLevels = [
          "Undergraduate",
          "Postgraduate",
          "Doctorate",
          "Certificate",
          "Diploma",
        ];
        if (!validStudyLevels.includes(row.studyLevel)) {
          result.errors.push(
            `Row ${rowNumber}: Invalid study level "${row.studyLevel}"`
          );
          result.failed++;
          continue;
        }

        // Create course data
        const courseData = {
          universityId: university._id,
          countryId: country._id,
          programName: row.programName ? row.programName.toString().trim() : "",
          studyLevel: row.studyLevel as
            | "Undergraduate"
            | "Postgraduate"
            | "Doctorate"
            | "Certificate"
            | "Diploma",
          campus:
            (row.campus ? row.campus.toString().trim() : "") || "Main Campus",
          duration:
            (row.duration ? row.duration.toString().trim() : "") ||
            "Not specified",
          openIntakes:
            (row.openIntakes ? row.openIntakes.toString().trim() : "") ||
            "Not specified",
          intakeYear:
            (row.intakeYear ? row.intakeYear.toString().trim() : "") ||
            new Date().getFullYear().toString(),
          entryRequirements:
            (row.entryRequirements
              ? row.entryRequirements.toString().trim()
              : "") || "Not specified",
          ieltsScore,
          ieltsNoBandLessThan,
          pteScore,
          pteNoBandLessThan,
          toeflScore,
          duolingo,
          gmatScore,
          greScore,
          yearlyTuitionFees:
            (row.yearlyTuitionFees
              ? row.yearlyTuitionFees.toString().trim()
              : "") || "Contact University",
          currency:
            (row.currency ? row.currency.toString().trim() : "") || "USD",
          applicationDeadline: row.applicationDeadline
            ? row.applicationDeadline.toString().trim()
            : undefined,
          workExperience: row.workExperience
            ? row.workExperience.toString().trim()
            : undefined,
          scholarships,
          careerProspects,
          accreditation,
          specializations,
        };

        // Check if course already exists
        const existingCourse = await Course.findOne({
          universityId: university._id,
          programName: courseData.programName,
          studyLevel: courseData.studyLevel,
        });

        if (existingCourse) {
          result.errors.push(
            `Row ${rowNumber}: Course "${row.programName}" already exists at "${row.universityName}"`
          );
          result.failed++;
          continue;
        }

        // Create course
        const course = new Course(courseData);
        await course.save();

        result.success++;
      } catch (error) {
        result.errors.push(
          `Row ${rowNumber}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        result.failed++;
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in bulk import:", error);
    return NextResponse.json(
      { error: "Failed to process bulk import" },
      { status: 500 }
    );
  }
}

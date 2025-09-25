import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { UniversityPageClient } from "./university-page-client";

interface UniversityPageProps {
  params: Promise<{
    countryId: string;
    universityId: string;
  }>;
}

// Helper function to fetch university data from API
async function getUniversityData(universitySlug: string) {
  try {
    // First try to get by MongoDB ObjectId (backward compatibility)
    if (universitySlug.match(/^[0-9a-fA-F]{24}$/)) {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/universities/${universitySlug}`,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();
      if (data.university) return data.university;
    }

    // Get all universities and find by slug
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/universities?populate=true`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    const universities = data.universities || [];

    // Import slug utilities
    const { generateUniversitySlug } = await import("@/lib/slug-utils");

    // Find university by matching slug
    for (const university of universities) {
      const slug = generateUniversitySlug(university.name);
      if (slug === universitySlug) {
        return university;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching university data:", error);
    return null;
  }
}

// Helper function to fetch courses for a university
async function getCoursesForUniversity(universityId: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/courses?universityId=${universityId}&populate=true`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );
    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Generate static params - now dynamic since we use API data
export async function generateStaticParams() {
  // Return empty array to make all pages dynamic
  // In production, you might want to pre-generate for popular universities
  return [];
}

// Generate metadata for each university page
export async function generateMetadata({
  params,
}: UniversityPageProps): Promise<Metadata> {
  const { countryId, universityId } = await params;

  // Try to get real university data from API first
  const universityData = await getUniversityData(universityId);

  if (!universityData) {
    return {
      title: "University Not Found - Career HQ",
    };
  }

  // Get country name - try from university data first, then fallback
  const countryName = universityData.country?.name || countryId;

  return {
    title: `${universityData.name} - Study in ${countryName} | Career HQ`,
    description: `${
      universityData.description ||
      `Explore programs at ${universityData.name}.`
    } Get expert guidance for admissions, scholarships, and visa assistance.`,
    keywords: [
      universityData.name.toLowerCase(),
      `${universityData.name.toLowerCase()} programs`,
      `study at ${universityData.name.toLowerCase()}`,
      `${countryName.toLowerCase()} universities`,
      "international education",
      "study abroad",
    ],
    openGraph: {
      title: `${universityData.name} - Study in ${countryName}`,
      description: `Discover programs at ${universityData.name}. Get expert guidance for your international education journey.`,
      images: [universityData.imageId || "/default-university-image.jpg"],
    },
  };
}

export default async function UniversityPage({ params }: UniversityPageProps) {
  const { countryId, universityId: _universityId } = await params;

  // Try to get real university data from API first
  let universityData = await getUniversityData(_universityId);
  let courses = [];

  if (universityData) {
    // Get courses for this university using the actual university ID
    courses = await getCoursesForUniversity(
      universityData.id || universityData._id
    );

    // Ensure university data has required fields with fallbacks
    universityData = {
      ...universityData,
      imageId: universityData.imageId || universityData.image || "",
      description:
        universityData.description || `Learn more about ${universityData.name}`,
      location: universityData.location || "Location not specified",
      type: universityData.type || "University",
      campusSize: universityData.campusSize || "Not specified",
      studentPopulation: universityData.studentPopulation || "Not specified",
      internationalStudents:
        universityData.internationalStudents || "Not specified",
      accommodation:
        universityData.accommodation ||
        "Contact university for accommodation details",
      facilities: universityData.facilities || [
        "Contact university for facilities information",
      ],
      website: universityData.website || "#",
      ranking: universityData.ranking || "Not ranked",
      established: universityData.established || "Not specified",
    };
  }

  if (!universityData) {
    notFound();
  }

  // Get country name - try from university data first, then fallback
  const countryName = universityData.country?.name || countryId;

  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://career-hq.com" },
    { name: "Study Abroad", url: "https://career-hq.com/study-abroad" },
    {
      name: countryName,
      url: `https://career-hq.com/study-abroad/${countryId}`,
    },
    {
      name: universityData.name,
      url: `https://career-hq.com/study-abroad/${countryId}/${_universityId}`,
    },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <UniversityPageClient
        universityData={universityData}
        countryId={countryId}
        universityId={_universityId}
        countryName={countryName}
        courses={courses}
      />
    </>
  );
}

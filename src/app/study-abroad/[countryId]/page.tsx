import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { CountryPageClient } from "./country-page-client";

interface CountryPageProps {
  params: Promise<{
    countryId: string;
  }>;
}

interface CountryApiResponse {
  id: string;
  name: string;
  code?: string;
  imageId?: string;
  description?: string;
  costOfLiving?: string;
  visaRequirements?: string;
  scholarshipsAvailable?: string;
}

interface UniversityApiResponse {
  id: string;
  name: string;
  courses?: number;
}

// Helper function to fetch country data from API
async function getCountryData(countrySlug: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/countries`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );
    const data = await response.json();

    if (data.countries) {
      // Import slug utilities
      const { generateCountrySlug } = await import("@/lib/slug-utils");

      // First try to find by MongoDB ObjectId (backward compatibility)
      if (countrySlug.match(/^[0-9a-fA-F]{24}$/)) {
        const country = data.countries.find(
          (c: CountryApiResponse) => c.id === countrySlug
        );
        if (country) return country;
      }

      // Then try to find by slug
      const country = data.countries.find((c: CountryApiResponse) => {
        const slug = generateCountrySlug(c.name);
        return slug === countrySlug;
      });

      if (country) return country;

      // Fallback: try by code or name (legacy support)
      return data.countries.find(
        (c: CountryApiResponse) =>
          c.code?.toLowerCase() === countrySlug.toLowerCase() ||
          c.name.toLowerCase().replace(/\s+/g, "") ===
            countrySlug.toLowerCase().replace(/\s+/g, "")
      );
    }
    return null;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return null;
  }
}

// Helper function to fetch universities for a country
async function getUniversitiesForCountry(countryId: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/universities?countryId=${countryId}&populate=true`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );
    const data = await response.json();
    return data.universities || [];
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

// Generate static params - we'll make this dynamic later
export async function generateStaticParams() {
  // For now, return empty array to make all pages dynamic
  // In production, you might want to pre-generate for popular countries
  return [];
}

// Generate metadata for each country page
export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { countryId } = await params;
  const countryData = await getCountryData(countryId);

  if (!countryData) {
    return {
      title: "Country Not Found - Career HQ",
    };
  }

  return {
    title: `Study in ${countryData.name} - Career HQ`,
    description: `${
      countryData.description ||
      `Explore world-class education opportunities in ${countryData.name}.`
    } Find universities and programs in ${countryData.name}.`,
    keywords: [
      `study in ${countryData.name.toLowerCase()}`,
      `${countryData.name.toLowerCase()} universities`,
      `${countryData.name.toLowerCase()} education`,
      "international education",
      "study abroad",
    ],
    openGraph: {
      title: `Study in ${countryData.name} - Find Your Perfect Program`,
      description: `Discover world-class education opportunities in ${countryData.name}.`,
      images: [countryData.imageId],
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { countryId } = await params;

  // Get country data from API
  const countryData = await getCountryData(countryId);

  if (!countryData) {
    notFound();
  }

  // Get universities for this country
  const universities = await getUniversitiesForCountry(countryData.id);

  // Transform country data to match expected interface
  const transformedCountryData = {
    name: countryData.name,
    imageId: countryData.imageId,
    description:
      countryData.description ||
      `Explore world-class education opportunities in ${countryData.name}.`,
    universities: universities.length,
    courses: universities.reduce(
      (total: number, uni: UniversityApiResponse) => total + (uni.courses || 0),
      0
    ),
    avgTuition: "Contact us for tuition information",
    costOfLiving:
      countryData.costOfLiving || "Contact us for cost of living information",
    workRights: "Contact us for work rights information",
    visaInfo: countryData.visaRequirements || "Contact us for visa information",
    scholarships:
      countryData.scholarshipsAvailable || "Various scholarships available",
    intakes: "Multiple intakes available throughout the year",
  };

  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://career-hq.com" },
    { name: "Study Abroad", url: "https://career-hq.com/study-abroad" },
    {
      name: countryData.name,
      url: `https://career-hq.com/study-abroad/${countryId}`,
    },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <CountryPageClient
        countryData={transformedCountryData}
        universities={universities}
        countryId={countryData.id}
      />
    </>
  );
}

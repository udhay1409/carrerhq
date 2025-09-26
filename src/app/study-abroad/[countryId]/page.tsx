import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { CountryPageClient } from "./country-page-client";

// Force this page to be dynamic
export const dynamic = "force-dynamic";

interface CountryPageProps {
  params: Promise<{
    countryId: string;
  }>;
}

interface UniversityApiResponse {
  id: string;
  name: string;
  courses?: number;
}

// Helper function to fetch country data from API
async function getCountryData(countrySlug: string) {
  const { logDataFetchError, log404Error, logNetworkError } = await import(
    "@/utils/errorUtils"
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/countries/${countrySlug}`;

  // Enhanced logging for debugging
  console.log("🔍 Fetching country data:", {
    countrySlug,
    baseUrl,
    apiUrl,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  try {
    // Use direct API call to the single country endpoint
    const response = await fetch(apiUrl, {
      cache: "no-store", // Ensure fresh data on every request
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    console.log("📡 API Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Country data received:", {
        countryName: data.country?.name,
        countryId: data.country?.id,
        hasData: !!data.country,
      });
      return data.country;
    }

    if (response.status === 404) {
      console.log("❌ Country not found (404):", countrySlug);
      log404Error("Country", countrySlug, {
        endpoint: `/api/countries/${countrySlug}`,
        status: response.status,
      });
      return null;
    }

    // Handle other HTTP errors (5xx, etc.)
    const errorText = await response
      .text()
      .catch(() => "Unable to read error response");
    const errorMessage = `API Error: ${response.status} ${response.statusText} - ${errorText}`;

    console.error("🚨 API Error:", {
      status: response.status,
      statusText: response.statusText,
      errorText,
      url: apiUrl,
    });

    logDataFetchError(errorMessage, "Country", countrySlug, {
      endpoint: `/api/countries/${countrySlug}`,
      status: response.status,
      statusText: response.statusText,
      errorText,
    });

    throw new Error(errorMessage);
  } catch (error) {
    console.error("💥 Fetch error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      countrySlug,
      apiUrl,
    });

    if (error instanceof TypeError && error.message.includes("fetch")) {
      // Network error
      logNetworkError(error, `/api/countries/${countrySlug}`, {
        countrySlug,
        apiUrl,
      });
    } else {
      // Other errors
      logDataFetchError(
        error instanceof Error ? error : String(error),
        "Country",
        countrySlug,
        {
          endpoint: `/api/countries/${countrySlug}`,
          apiUrl,
        }
      );
    }
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

  // Get country data from API using direct endpoint call
  const countryData = await getCountryData(countryId);

  // Trigger Next.js 404 page if country not found
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

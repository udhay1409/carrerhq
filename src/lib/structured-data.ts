import { Course } from "@/types/course";

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: {
    "@type": "ContactPoint";
    telephone: string;
    contactType: "customer service";
    availableLanguage: string[];
  };
  sameAs: string[];
}

export interface EducationalOrganizationSchema {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  name: string;
  url: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
  };
  hasOfferCatalog: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: CourseSchema[];
  };
}

export interface CourseSchema {
  "@context": "https://schema.org";
  "@type": "Course";
  name: string;
  description: string;
  provider: {
    "@type": "EducationalOrganization";
    name: string;
    address: {
      "@type": "PostalAddress";
      addressCountry: string;
    };
  };
  educationalLevel: string;
  timeRequired: string;
  inLanguage: string;
  offers: {
    "@type": "Offer";
    category: string;
    priceCurrency: string;
    price?: string;
  };
  hasCourseInstance: {
    "@type": "CourseInstance";
    courseMode: string;
    startDate?: string;
  };
}

export interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Career HQ",
    url: "https://career-hq.com",
    logo: "https://career-hq.com/logo.png",
    description:
      "Leading education consultancy helping students find the perfect university and course for their international education journey.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-CAREER",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://facebook.com/careerhq",
      "https://twitter.com/careerhq",
      "https://linkedin.com/company/careerhq",
      "https://instagram.com/careerhq",
    ],
  };
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Career HQ",
    url: "https://career-hq.com",
    description:
      "Find the perfect university and course for your international education journey",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://career-hq.com/all-courses?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateUniversitySchema(
  universityName: string,
  countryName: string,
  courses: Course[]
): EducationalOrganizationSchema {
  const courseSchemas = courses
    .slice(0, 10)
    .map((course) => generateCourseSchema(course));

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: universityName,
    url: `https://career-hq.com/study-abroad/${countryName.toLowerCase()}/${universityName
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    description: `${universityName} offers world-class education programs in ${countryName}. Explore ${courses.length} available courses and programs.`,
    address: {
      "@type": "PostalAddress",
      addressCountry: countryName,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${universityName} Course Catalog`,
      itemListElement: courseSchemas,
    },
  };
}

export function generateCourseSchema(course: Course): CourseSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.programName,
    description: `${course.programName} at ${course.university} in ${course.country}. Duration: ${course.duration}. Entry requirements: ${course.entryRequirements}`,
    provider: {
      "@type": "EducationalOrganization",
      name: course.university,
      address: {
        "@type": "PostalAddress",
        addressCountry: course.country,
      },
    },
    educationalLevel: course.studyLevel || "Higher Education",
    timeRequired: course.duration,
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      category: "Educational Course",
      priceCurrency: getCurrencyByCountry(course.country),
      price: course.yearlyTuitionFees,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "on-site",
      startDate: course.openIntakes,
    },
  };
}

function getCurrencyByCountry(country: string): string {
  const currencyMap: Record<string, string> = {
    Australia: "AUD",
    Canada: "CAD",
    UK: "GBP",
    USA: "USD",
    Germany: "EUR",
    Ireland: "EUR",
    France: "EUR",
    "New Zealand": "NZD",
  };
  return currencyMap[country] || "USD";
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

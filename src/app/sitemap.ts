import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://career-hq.com";

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/study-abroad",
    "/all-courses",
    "/blog",
  ];

  // Countries for study abroad
  const countries = [
    "australia",
    "canada",
    "uk",
    "usa",
    "germany",
    "ireland",
    "france",
    "new-zealand",
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const countryRoutes = countries.map((country) => ({
    url: `${baseUrl}/study-abroad/${country}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes];
}

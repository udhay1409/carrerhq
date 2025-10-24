import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";
import type { UniversalModule, ModuleCategory } from "@/types/universal-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "International Placement Opportunities | CareerHQ",
  description: "Explore job placements with global companies",
};

async function getModulesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [modulesRes, categoriesRes] = await Promise.all([
      fetch(
        `${baseUrl}/api/modules?moduleType=placement-abroad&published=true`,
        {
          cache: "no-store",
        }
      ),
      fetch(`${baseUrl}/api/modules/categories?moduleType=placement-abroad`, {
        cache: "no-store",
      }),
    ]);

    const modules: UniversalModule[] = modulesRes.ok
      ? await modulesRes.json()
      : [];
    const categories: ModuleCategory[] = categoriesRes.ok
      ? await categoriesRes.json()
      : [];

    return { modules, categories };
  } catch (error) {
    console.error("Error fetching modules data:", error);
    return { modules: [], categories: [] };
  }
}

export default async function PlacementAbroadPage() {
  const { modules, categories } = await getModulesData();

  return (
    <ModuleListingPage
      moduleType="placement-abroad"
      title="Placement Abroad"
      description="Discover international career opportunities with leading global companies"
      initialModules={modules}
      initialCategories={categories}
    />
  );
}

import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";
import type { UniversalModule, ModuleCategory } from "@/types/universal-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "School Projects | CareerHQ",
  description: "Find educational projects and programs for school students",
};

async function getModulesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [modulesRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/modules?moduleType=school-project&published=true`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/modules/categories?moduleType=school-project`, {
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

export default async function SchoolProjectsPage() {
  const { modules, categories } = await getModulesData();

  return (
    <ModuleListingPage
      moduleType="school-project"
      title="School Projects"
      description="Enhance learning with engaging school projects and programs"
      initialModules={modules}
      initialCategories={categories}
    />
  );
}

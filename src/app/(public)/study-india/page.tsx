import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";
import type { UniversalModule, ModuleCategory } from "@/types/universal-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Study in India | CareerHQ",
  description: "Find the best universities and courses in India",
};

async function getModulesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [modulesRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/modules?moduleType=study-india&published=true`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/modules/categories?moduleType=study-india`, {
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

export default async function StudyIndiaPage() {
  const { modules, categories } = await getModulesData();

  return (
    <ModuleListingPage
      moduleType="study-india"
      title="Study in India"
      description="Explore top universities and educational programs across India"
      initialModules={modules}
      initialCategories={categories}
    />
  );
}

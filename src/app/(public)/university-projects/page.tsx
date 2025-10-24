import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";
import type { UniversalModule, ModuleCategory } from "@/types/universal-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "University Projects | CareerHQ",
  description: "Explore research and project opportunities at universities",
};

async function getModulesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [modulesRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/modules?moduleType=uni-project&published=true`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/modules/categories?moduleType=uni-project`, {
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

export default async function UniversityProjectsPage() {
  const { modules, categories } = await getModulesData();

  return (
    <ModuleListingPage
      moduleType="uni-project"
      title="University Projects"
      description="Collaborate on cutting-edge research and academic projects"
      initialModules={modules}
      initialCategories={categories}
    />
  );
}

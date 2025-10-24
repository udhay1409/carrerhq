import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";
import type { UniversalModule, ModuleCategory } from "@/types/universal-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "MBBS in India | CareerHQ",
  description: "Find the best MBBS colleges and programs in India",
};

async function getModulesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [modulesRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/modules?moduleType=mbbs-india&published=true`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/modules/categories?moduleType=mbbs-india`, {
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

export default async function MBBSIndiaPage() {
  const { modules, categories } = await getModulesData();

  return (
    <ModuleListingPage
      moduleType="mbbs-india"
      title="MBBS in India"
      description="Explore top medical colleges and MBBS programs across India"
      initialModules={modules}
      initialCategories={categories}
    />
  );
}

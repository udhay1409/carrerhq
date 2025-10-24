import { Metadata } from "next";
import ModuleDetailPage from "@/components/public/module-detail-page";
import { notFound } from "next/navigation";
import { getModule } from "@/lib/get-module";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const moduleData = await getModule(id);

  if (moduleData) {
    return {
      title: `${moduleData.title} | MBBS Abroad | CareerHQ`,
      description: moduleData.shortDescription,
    };
  }

  return {
    title: "MBBS Abroad | CareerHQ",
    description: "Explore MBBS programs abroad",
  };
}

export default async function MBBSAbroadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moduleData = await getModule(id);

  if (!moduleData) {
    notFound();
  }

  return <ModuleDetailPage module={moduleData} moduleType="mbbs-abroad" />;
}

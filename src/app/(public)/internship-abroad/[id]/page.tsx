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
      title: `${moduleData.title} | Internship Abroad | CareerHQ`,
      description: moduleData.shortDescription,
    };
  }

  return {
    title: "Internship Abroad | CareerHQ",
    description: "Explore international internship opportunities",
  };
}

export default async function InternshipAbroadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const module = await getModule(id);

  if (!module) {
    notFound();
  }

  return <ModuleDetailPage module={module} moduleType="internship-abroad" />;
}

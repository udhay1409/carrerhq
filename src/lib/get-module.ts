import type { UniversalModule } from "@/types/universal-module";

export async function getModule(id: string): Promise<UniversalModule | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/modules/${id}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching module:", error);
  }

  return null;
}

import { logApiError, logNetworkError } from "@/utils/errorUtils";

const AUTOMATION_API_URL =
  "https://admin.isuite.io/api/automations/68d2868a9cd57/execute";

interface ContactFormData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const response = await fetch(AUTOMATION_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_token: process.env.NEXT_PUBLIC_API_TOKEN,
        ...data,
      }),
    });

    if (!response.ok) {
      logApiError(
        `Failed to submit contact form: ${response.status}`,
        AUTOMATION_API_URL,
        data as unknown as Record<string, unknown>,
        response.status
      );
      throw new Error("Failed to submit form");
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      logNetworkError(
        error,
        AUTOMATION_API_URL,
        data as unknown as Record<string, unknown>
      );
    }
    throw error; // Re-throw to maintain existing error handling
  }
}

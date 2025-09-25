const AUTOMATION_API_URL =
  "https://admin.isuite.io/api/automations/68d2868a9cd57/execute";

interface ContactFormData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

export async function submitContactForm(data: ContactFormData) {
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
    throw new Error("Failed to submit form");
  }

  return response.json();
}

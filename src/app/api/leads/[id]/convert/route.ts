import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/lead";
import { NextResponse } from "next/server";
import { submitContactForm } from "@/lib/api-client";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectToDatabase();

    // Find the lead using the extracted id
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Submit to automation API
    await submitContactForm({
      contact_name: lead.name,
      contact_email: lead.email,
      contact_phone: lead.phone.startsWith("+91")
        ? lead.phone
        : `+91${lead.phone}`,
    });

    // Update lead status
    lead.status = "converted";
    await lead.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error converting lead:", error);
    return NextResponse.json(
      { error: "Failed to convert lead" },
      { status: 500 }
    );
  }
}

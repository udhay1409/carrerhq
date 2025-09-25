import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  country?: string;
  university?: string;
  program?: string;
  qualification?: string;
  ieltsScore?: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: String,
    university: String,
    program: String,
    qualification: String,
    ieltsScore: String,
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export const Lead =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

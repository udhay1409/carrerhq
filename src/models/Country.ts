import mongoose, { Schema, type Document } from "mongoose";
import type { Country } from "@/types/education";

export interface ICountry extends Omit<Country, "id">, Document {
  _id: string;
}

const CountrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: false, // Made optional since you didn't specify it as required
      trim: true,
      uppercase: true,
    },
    flagImageId: {
      type: String,
      trim: true,
    },
    imageId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    costOfLiving: {
      type: String,
      trim: true,
    },
    visaRequirements: {
      type: String,
      trim: true,
    },
    scholarshipsAvailable: {
      type: String,
      trim: true,
    },
    published: {
      type: Boolean,
      default: true, // Default to published for existing countries
    },
    // Keep some existing fields for backward compatibility
    currency: {
      type: String,
      required: false,
      trim: true,
    },
    language: {
      type: String,
      required: false,
      trim: true,
    },
    timezone: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes for better query performance
// Note: name field already has unique index, code field index added below
CountrySchema.index({ code: 1 });

export default mongoose.models.Country ||
  mongoose.model<ICountry>("Country", CountrySchema);

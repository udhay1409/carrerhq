import mongoose, { Schema, type Document } from "mongoose";
import type { University } from "@/types/education";
import { generateUniversitySlug } from "@/lib/slug-utils";

export interface IUniversity
  extends Omit<University, "id" | "country" | "countryId">,
    Document {
  _id: string;
  countryId: mongoose.Types.ObjectId;
  slug?: string;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
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
    ranking: {
      type: Number,
      min: 1,
    },
    established: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear(),
    },
    type: {
      type: String,
      enum: ["Public", "Private"],
      required: true,
    },
    campusSize: {
      type: String,
      trim: true,
    },
    studentPopulation: {
      type: String,
      trim: true,
    },
    internationalStudents: {
      type: String,
      trim: true,
    },
    accommodation: {
      type: String,
      trim: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true, // Default to published for existing universities
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

// Pre-save middleware to generate slug
UniversitySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = generateUniversitySlug(this.name);
  }
  next();
});

// Create indexes for better query performance
// Note: slug field already has unique index from schema definition
UniversitySchema.index({ countryId: 1 });
UniversitySchema.index({ ranking: 1 });
UniversitySchema.index({ type: 1 });
UniversitySchema.index({ name: "text", description: "text", location: "text" });

// Compound index for country-university queries
UniversitySchema.index({ countryId: 1, name: 1 });

export default mongoose.models.University ||
  mongoose.model<IUniversity>("University", UniversitySchema);

import mongoose, { Schema, type Document } from "mongoose";
import type { Course } from "@/types/education";

export interface ICourse
  extends Omit<
      Course,
      "id" | "university" | "country" | "universityId" | "countryId"
    >,
    Document {
  _id: string;
  universityId: mongoose.Types.ObjectId;
  countryId: mongoose.Types.ObjectId;
}

const CourseSchema = new Schema<ICourse>(
  {
    universityId: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    programName: {
      type: String,
      required: true,
      trim: true,
    },
    studyLevel: {
      type: String,
      enum: [
        "Undergraduate",
        "Postgraduate",
        "Doctorate",
        "Certificate",
        "Diploma",
      ],
      required: true,
    },
    campus: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    openIntakes: {
      type: String,
      required: true,
      trim: true,
    },
    intakeYear: {
      type: String,
      required: true,
      trim: true,
    },
    entryRequirements: {
      type: String,
      required: true,
      trim: true,
    },
    ieltsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 9,
    },
    ieltsNoBandLessThan: {
      type: Number,
      required: true,
      min: 0,
      max: 9,
    },
    pteScore: {
      type: Number,
      min: 0,
      max: 90,
    },
    pteNoBandLessThan: {
      type: Number,
      min: 0,
      max: 90,
    },
    toeflScore: {
      type: Number,
      min: 0,
      max: 120,
    },
    duolingo: {
      type: Number,
      min: 0,
      max: 160,
    },
    gmatScore: {
      type: Number,
      min: 200,
      max: 800,
    },
    greScore: {
      type: Number,
      min: 260,
      max: 340,
    },
    yearlyTuitionFees: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      trim: true,
      default: "USD",
    },
    applicationDeadline: {
      type: String,
      trim: true,
    },
    workExperience: {
      type: String,
      trim: true,
    },
    scholarships: {
      type: [String],
      default: [],
    },
    careerProspects: {
      type: [String],
      default: [],
    },
    accreditation: {
      type: [String],
      default: [],
    },
    specializations: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true, // Default to published for existing courses
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
CourseSchema.index({ programName: 1 });
CourseSchema.index({ universityId: 1 });
CourseSchema.index({ countryId: 1 });
CourseSchema.index({ studyLevel: 1 });
CourseSchema.index({ ieltsScore: 1 });
CourseSchema.index({ yearlyTuitionFees: 1 });
CourseSchema.index({ programName: "text", entryRequirements: "text" });

// Compound indexes for common queries
CourseSchema.index({ countryId: 1, universityId: 1 });
CourseSchema.index({ countryId: 1, studyLevel: 1 });
CourseSchema.index({ universityId: 1, studyLevel: 1 });

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);

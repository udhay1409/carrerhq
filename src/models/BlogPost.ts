import mongoose, { Schema, type Document } from "mongoose";
import type { BlogPost, BlogContent } from "@/types/blog";

export interface IBlogPost extends Omit<BlogPost, "id">, Document {
  _id: string;
}

const BlogContentSchema = new Schema<BlogContent>(
  {
    type: {
      type: String,
      enum: ["heading", "paragraph"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: [BlogContentSchema],
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorRole: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
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
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ author: 1 });
BlogPostSchema.index({ createdAt: -1 });
BlogPostSchema.index({ title: "text", excerpt: "text", author: "text" });

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

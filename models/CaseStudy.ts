import mongoose, { Schema, models } from "mongoose";

const ContentBlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    text: { type: String, default: "" },
    label: { type: String, default: "" },
    url: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" }, // optional cover
    published: { type: Boolean, default: false },

    content_blocks: { type: [ContentBlockSchema], default: [] },
  },
  { timestamps: true }
);

export const CaseStudy =
  models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);

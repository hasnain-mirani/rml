import mongoose, { Schema, models } from "mongoose";

const ContentBlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // "text" | "image" | "link"
    text: { type: String, default: "" }, // for text blocks
    url: { type: String, default: "" }, // for image/link blocks
    label: { type: String, default: "" }, // for link label
    alt: { type: String, default: "" }, // for image alt
  },
  { _id: false }
);

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" }, // cover image (Cloudinary URL)
    published: { type: Boolean, default: false },

    content_blocks: { type: [ContentBlockSchema], default: [] },
  },
  { timestamps: true }
);

export const Portfolio =
  models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

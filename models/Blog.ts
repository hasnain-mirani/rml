import mongoose, { Schema, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "General", trim: true }, // ✅ NEW
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" }, // Cloudinary URL
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Blog = models.Blog || mongoose.model("Blog", BlogSchema);

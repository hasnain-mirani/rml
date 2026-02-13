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

const PodcastSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "Podcast", trim: true },
    excerpt: { type: String, default: "" },
    date: { type: String, default: "" }, // YYYY-MM-DD (optional)
    image: { type: String, default: "" }, // Cloudinary URL
    published: { type: Boolean, default: false },

    // ✅ rich blocks (text/link/image/youtube/spotify/apple)
    content_blocks: { type: [ContentBlockSchema], default: [] },
  },
  { timestamps: true }
);

export const Podcast = models.Podcast || mongoose.model("Podcast", PodcastSchema);

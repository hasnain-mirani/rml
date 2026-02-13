import mongoose, { Schema, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // person/company
    text: { type: String, required: true, trim: true },
    image: { type: String, default: "" }, // Cloudinary URL

    linkEnabled: { type: Boolean, default: false },
    linkUrl: { type: String, default: "" },

    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial =
  models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

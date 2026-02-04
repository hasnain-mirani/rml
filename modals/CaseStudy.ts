import mongoose, { Schema } from "mongoose";

const MetricSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CaseStudySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },

    label: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },

    overviewTitle: { type: String, required: true, trim: true },
    overviewText: { type: String, required: true, trim: true },

    highlightsTitle: { type: String, required: true, trim: true },
    highlights: { type: [String], required: true, default: [] },

    resultsTitle: { type: String, required: true, trim: true },
    results: { type: [MetricSchema], required: true, default: [] },

    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CaseStudy =
  mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);

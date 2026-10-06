import mongoose, { Schema, type HydratedDocument } from "mongoose";

/** Mirrors the `CaseStudy` type in data/caseStudies.ts. */
export interface CaseStudyDoc {
  slug: string;
  client: string;
  category: string;
  industry: string;
  timeline: string;
  serviceSlug: string;
  tools: string[];
  title: string;
  image: string;
  resultStat: string;
  resultLabel: string;
  problem: string;
  solution: string;
  results: string[];
  quote: { text: string; author: string; role: string };
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CaseStudyHydrated = HydratedDocument<CaseStudyDoc>;

const CaseStudySchema = new Schema<CaseStudyDoc>(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"],
    },
    client: { type: String, required: [true, "Client name is required"], trim: true },
    category: { type: String, required: [true, "Category is required"], trim: true },
    industry: { type: String, default: "", trim: true },
    timeline: { type: String, default: "", trim: true },
    serviceSlug: { type: String, default: "", trim: true },
    tools: { type: [String], default: [] },
    title: { type: String, required: [true, "Title is required"], trim: true },
    image: { type: String, required: [true, "Image is required"], trim: true },
    resultStat: { type: String, default: "", trim: true },
    resultLabel: { type: String, default: "", trim: true },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: [String], default: [] },
    quote: {
      text: { type: String, default: "" },
      author: { type: String, default: "" },
      role: { type: String, default: "" },
    },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CaseStudySchema.index({ published: 1, order: 1 });

export default (mongoose.models.CaseStudy as mongoose.Model<CaseStudyDoc>) ||
  mongoose.model<CaseStudyDoc>("CaseStudy", CaseStudySchema);

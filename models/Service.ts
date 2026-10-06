import mongoose, { Schema, type HydratedDocument } from "mongoose";

/**
 * Mirrors the `Service` type in data/services.ts exactly, so the public
 * service pages can read from MongoDB without any shape changes. The
 * original file is kept as the seed source and as a fallback.
 */
export interface ServiceDoc {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  oneLiner: string;
  positioning: string;
  whatIs: string;
  theme: { from: string; to: string; tint: string; glow: string };
  accentIcons: string[];
  stats: { value: string; label: string }[];
  whoFor: string[];
  quote: { text: string; author: string; role: string };
  process: { title: string; description: string }[];
  included: string[];
  benefits: string[];
  tools: string[];
  packages: {
    name: string;
    price: string;
    cadence: string;
    description: string;
    features: string[];
    highlighted?: boolean;
  }[];
  customQuoteOnly: boolean;
  faqs: { q: string; a: string }[];
  category: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceHydrated = HydratedDocument<ServiceDoc>;

const ServiceSchema = new Schema<ServiceDoc>(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"],
    },
    name: { type: String, required: [true, "Name is required"], trim: true },
    shortName: { type: String, required: [true, "Short name is required"], trim: true },
    icon: { type: String, required: [true, "Icon name is required"], trim: true, default: "Sparkles" },
    oneLiner: { type: String, required: [true, "One-liner is required"], trim: true },
    positioning: { type: String, required: [true, "Positioning is required"], trim: true },
    whatIs: { type: String, required: [true, "'What is' description is required"], trim: true },
    theme: {
      from: { type: String, default: "#C81E2C" },
      to: { type: String, default: "#FF4B3E" },
      tint: { type: String, default: "#FFF1F0" },
      glow: { type: String, default: "200, 30, 44" },
    },
    accentIcons: { type: [String], default: [] },
    stats: {
      type: [{ value: String, label: String, _id: false }],
      default: [],
    },
    whoFor: { type: [String], default: [] },
    quote: {
      text: { type: String, default: "" },
      author: { type: String, default: "" },
      role: { type: String, default: "" },
    },
    process: {
      type: [{ title: String, description: String, _id: false }],
      default: [],
    },
    included: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    packages: {
      type: [
        {
          name: String,
          price: String,
          cadence: String,
          description: String,
          features: [String],
          highlighted: { type: Boolean, default: false },
          _id: false,
        },
      ],
      default: [],
    },
    customQuoteOnly: { type: Boolean, default: false },
    faqs: {
      type: [{ q: String, a: String, _id: false }],
      default: [],
    },
    category: { type: String, required: [true, "Category is required"], trim: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ published: 1, order: 1 });

export default (mongoose.models.Service as mongoose.Model<ServiceDoc>) ||
  mongoose.model<ServiceDoc>("Service", ServiceSchema);

import mongoose, { Schema, type HydratedDocument } from "mongoose";

export interface SiteFAQDoc {
  question: string;
  answer: string;
  /** Grouping shown on the /faq page, e.g. "General", "Pricing", "Process". */
  category: string;
  /** Whether this FAQ also appears in the short list on the home page. */
  showOnHome: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SiteFAQHydrated = HydratedDocument<SiteFAQDoc>;

const SiteFAQSchema = new Schema<SiteFAQDoc>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: 300,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "General",
    },
    showOnHome: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

SiteFAQSchema.index({ published: 1, order: 1 });
SiteFAQSchema.index({ showOnHome: 1, order: 1 });

export default (mongoose.models.SiteFAQ as mongoose.Model<SiteFAQDoc>) ||
  mongoose.model<SiteFAQDoc>("SiteFAQ", SiteFAQSchema);

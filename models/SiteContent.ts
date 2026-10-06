import mongoose, { Schema, type HydratedDocument } from "mongoose";

/**
 * A generic, editable piece of site content addressed by a stable `key`
 * (e.g. "home.hero.headline"). Public pages read these via lib/content.ts,
 * which falls back to the original hard-coded copy whenever a key hasn't
 * been overridden yet — so adding this system can never blank out a page.
 */
export type SiteContentType = "text" | "textarea" | "image" | "url" | "list";

export interface SiteContentDoc {
  key: string;
  value: string;
  /** Used for list-type content, stored separately so `value` stays a string. */
  items: string[];
  type: SiteContentType;
  /** Page/section grouping used to organise the admin UI, e.g. "Home — Hero". */
  group: string;
  /** Human-friendly label shown in the dashboard. */
  label: string;
  /** Optional helper text shown under the field in the dashboard. */
  hint?: string;
  /** Sort order within its group. */
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SiteContentHydrated = HydratedDocument<SiteContentDoc>;

const SiteContentSchema = new Schema<SiteContentDoc>(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      default: "",
    },
    items: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["text", "textarea", "image", "url", "list"],
      default: "text",
    },
    group: {
      type: String,
      required: [true, "Group is required"],
      trim: true,
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      trim: true,
    },
    hint: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

SiteContentSchema.index({ group: 1, order: 1 });

export default (mongoose.models.SiteContent as mongoose.Model<SiteContentDoc>) ||
  mongoose.model<SiteContentDoc>("SiteContent", SiteContentSchema);

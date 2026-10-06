import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type LinkInsertionStatus = "pending" | "approved" | "rejected" | "live" | "completed";

export interface LinkInsertionDoc {
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  targetUrl: string;
  anchorText: string;
  // Free-text reference to the article/blog post the client wants the link
  // placed in (e.g. a URL or title they typed on the public form).
  relatedArticle?: string;
  // Optional link to one of our own Post documents, set by the admin once
  // they've picked which published article the link will actually go in.
  relatedPost?: mongoose.Types.ObjectId;
  message?: string;
  price?: number;
  status: LinkInsertionStatus;
  notes?: string;
  source: "public_form" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export type LinkInsertionHydrated = HydratedDocument<LinkInsertionDoc>;

const LinkInsertionSchema = new Schema<LinkInsertionDoc>(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    clientCompany: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    targetUrl: {
      type: String,
      required: [true, "Target URL is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "Target URL must start with http:// or https://"],
    },
    anchorText: {
      type: String,
      required: [true, "Anchor text is required"],
      trim: true,
      maxlength: 200,
    },
    relatedArticle: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    price: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "live", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    source: {
      type: String,
      enum: ["public_form", "admin"],
      default: "public_form",
    },
  },
  { timestamps: true }
);

LinkInsertionSchema.index({ status: 1, createdAt: -1 });
LinkInsertionSchema.index({ clientEmail: 1 });

export default (mongoose.models.LinkInsertion as mongoose.Model<LinkInsertionDoc>) ||
  mongoose.model<LinkInsertionDoc>("LinkInsertion", LinkInsertionSchema);

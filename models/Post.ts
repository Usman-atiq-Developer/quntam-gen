import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type PostStatus = "draft" | "published";

export interface PostFAQ {
  q: string;
  a: string;
}

export type SearchIntent = "informational" | "commercial" | "transactional" | "navigational";

export interface PostDoc {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  authorRole: string;
  authorPhoto?: string;
  status: PostStatus;
  publishedAt: Date;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords: string[];
  searchIntent?: SearchIntent;
  takeaways: string[];
  faqs: PostFAQ[];
  /**
   * Controls the `robots` meta tag on the public post page and whether the
   * post is included in the XML sitemap — completely independent of
   * `status`. `true` (the default) preserves the pre-existing behavior of
   * every post ever created: indexable. Set to `false` to keep a post live
   * and crawlable but hidden from search results (`noindex, follow`).
   * Documents written before this field existed simply don't have it set;
   * every read path treats "missing" the same as `true` so old posts keep
   * behaving exactly as they did before this feature shipped.
   */
  robotsIndex: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PostHydrated = HydratedDocument<PostDoc>;

const PostFAQSchema = new Schema<PostFAQ>(
  {
    q: { type: String, required: true, trim: true },
    a: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PostSchema = new Schema<PostDoc>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: 400,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      default: "Quntam Gen Team",
    },
    authorRole: {
      type: String,
      required: [true, "Author role is required"],
      trim: true,
      default: "Editorial",
    },
    authorPhoto: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    primaryKeyword: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    secondaryKeywords: {
      type: [String],
      default: [],
    },
    searchIntent: {
      type: String,
      enum: ["informational", "commercial", "transactional", "navigational"],
    },
    takeaways: {
      type: [String],
      default: [],
    },
    faqs: {
      type: [PostFAQSchema],
      default: [],
    },
    robotsIndex: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ status: 1, robotsIndex: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });

export default (mongoose.models.Post as mongoose.Model<PostDoc>) ||
  mongoose.model<PostDoc>("Post", PostSchema);

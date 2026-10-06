import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type ContactMessageStatus = "new" | "read" | "archived";

export interface ContactMessageDoc {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageHydrated = HydratedDocument<ContactMessageDoc>;

const ContactMessageSchema = new Schema<ContactMessageDoc>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    budget: {
      type: String,
      required: [true, "Budget range is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

ContactMessageSchema.index({ status: 1, createdAt: -1 });

export default (mongoose.models.ContactMessage as mongoose.Model<ContactMessageDoc>) ||
  mongoose.model<ContactMessageDoc>("ContactMessage", ContactMessageSchema);

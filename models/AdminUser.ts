import mongoose, { Schema, type HydratedDocument } from "mongoose";

export interface AdminUserDoc {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminUserHydrated = HydratedDocument<AdminUserDoc>;

const AdminUserSchema = new Schema<AdminUserDoc>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.AdminUser as mongoose.Model<AdminUserDoc>) ||
  mongoose.model<AdminUserDoc>("AdminUser", AdminUserSchema);

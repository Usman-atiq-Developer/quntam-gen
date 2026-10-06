/**
 * Creates (or updates) the single admin account used to log into
 * /admin. Run with:
 *
 *   npm run seed:admin
 *
 * Reads ADMIN_EMAIL, ADMIN_PASSWORD, and optionally ADMIN_NAME from
 * .env.local. If an admin with that email already exists, its password
 * and name are updated instead of creating a duplicate — so this script
 * is also how you reset a forgotten admin password.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import AdminUser from "../models/AdminUser";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!uri) {
    console.error("Missing MONGODB_URI in .env.local. See .env.local.example.");
    process.exit(1);
  }
  if (!email || !password) {
    console.error(
      "Missing ADMIN_EMAIL and/or ADMIN_PASSWORD in .env.local. See .env.local.example."
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters long.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const passwordHash = await hashPassword(password);
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await AdminUser.findOne({ email: normalizedEmail });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    await existing.save();
    console.log(`Updated existing admin account: ${normalizedEmail}`);
  } else {
    await AdminUser.create({ email: normalizedEmail, passwordHash, name });
    console.log(`Created admin account: ${normalizedEmail}`);
  }

  await mongoose.disconnect();
  console.log("Done. You can now log in at /admin/login");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed admin account:", err);
  process.exit(1);
});

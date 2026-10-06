import { v2 as cloudinary } from "cloudinary";

/**
 * Thrown when Cloudinary credentials are missing, so the upload API route
 * can return a clear, actionable message instead of a generic 500.
 */
export class CloudinaryConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryConfigError";
  }
}

let configured = false;

/**
 * Configures the Cloudinary SDK from environment variables. The API secret is
 * only ever read on the server — uploads go through /api/admin/upload rather
 * than straight from the browser, so credentials are never exposed to clients.
 */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new CloudinaryConfigError(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local (see .env.local.example)."
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

/** Folder inside your Cloudinary account where all site uploads are stored. */
export const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || "quntam-gen";

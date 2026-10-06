import { NextResponse } from "next/server";
import { getCloudinary, CloudinaryConfigError, UPLOAD_FOLDER } from "@/lib/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
// SVG intentionally excluded: an SVG file can embed <script>/event-handler
// attributes, which execute if the file is ever opened directly (a new
// tab, an <object>/<iframe> embed) rather than only used as an <img> src.
// Cloudinary also disables raw SVG delivery by default for the same
// reason. If you need vector icon uploads, sanitize server-side first.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * Uploads an image to Cloudinary and returns its hosted URL.
 * Protected by middleware.ts (admin session required).
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP, AVIF, or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Image is too large (max ${MAX_BYTES / 1024 / 1024} MB).` },
      { status: 400 }
    );
  }

  try {
    const cloudinary = getCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string; public_id: string; width: number; height: number }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: UPLOAD_FOLDER,
            resource_type: "image",
            // Let Cloudinary pick the most efficient format and quality for
            // each visitor's browser, which keeps pages fast automatically.
            fetch_format: "auto",
            quality: "auto",
          },
          (error, uploaded) => {
            if (error || !uploaded) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve(uploaded as never);
          }
        );
        stream.end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    if (err instanceof CloudinaryConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("[upload] Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

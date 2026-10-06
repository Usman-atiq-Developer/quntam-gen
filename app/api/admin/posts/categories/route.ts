import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Post from "@/models/Post";
import { toApiErrorResponse } from "@/lib/apiError";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Post.distinct("category");
    return NextResponse.json({
      categories: categories.filter(Boolean).sort((a: string, b: string) => a.localeCompare(b)),
    });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load categories");
  }
}

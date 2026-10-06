import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import ContactMessage from "@/models/ContactMessage";
import { toApiErrorResponse } from "@/lib/apiError";
import { escapeRegex } from "@/lib/searchRegex";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const query: Record<string, unknown> = {};
    if (status && ["new", "read", "archived"].includes(status)) {
      query.status = status;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { message: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ messages });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load messages");
  }
}

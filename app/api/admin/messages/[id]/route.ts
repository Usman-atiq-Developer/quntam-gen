import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import ContactMessage from "@/models/ContactMessage";
import { toApiErrorResponse } from "@/lib/apiError";

const updateSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const message = await ContactMessage.findById(id).lean();
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ message });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load message");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid update" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true, runValidators: true }
    ).lean();

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ message });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to update message");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deleted = await ContactMessage.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to delete message");
  }
}

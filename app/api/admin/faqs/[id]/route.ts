import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import SiteFAQ from "@/models/SiteFAQ";
import { toApiErrorResponse } from "@/lib/apiError";

const updateSchema = z.object({
  question: z.string().min(3).max(300).optional(),
  answer: z.string().min(3).max(3000).optional(),
  category: z.string().min(1).optional(),
  showOnHome: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

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
    const faq = await SiteFAQ.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json({ faq });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to update FAQ");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deleted = await SiteFAQ.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to delete FAQ");
  }
}

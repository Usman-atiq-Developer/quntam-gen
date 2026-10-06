import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import LinkInsertion from "@/models/LinkInsertion";
import { toApiErrorResponse } from "@/lib/apiError";

const STATUSES = ["pending", "approved", "rejected", "live", "completed"] as const;

const updateSchema = z.object({
  clientName: z.string().min(2).optional(),
  clientEmail: z.string().email().optional(),
  clientCompany: z.string().optional(),
  targetUrl: z.string().url().optional(),
  anchorText: z.string().min(1).optional(),
  relatedArticle: z.string().optional(),
  relatedPost: z.string().optional().nullable(),
  message: z.string().optional(),
  price: z.number().min(0).optional().nullable(),
  status: z.enum(STATUSES).optional(),
  notes: z.string().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const linkInsertion = await LinkInsertion.findById(id)
      .populate("relatedPost", "title slug")
      .lean();
    if (!linkInsertion) {
      return NextResponse.json({ error: "Link insertion not found" }, { status: 404 });
    }
    return NextResponse.json({ linkInsertion });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load link insertion");
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

    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.relatedPost === "") {
      update.relatedPost = null;
    }
    if (parsed.data.price === null) {
      update.price = undefined;
    }

    const linkInsertion = await LinkInsertion.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("relatedPost", "title slug")
      .lean();

    if (!linkInsertion) {
      return NextResponse.json({ error: "Link insertion not found" }, { status: 404 });
    }
    return NextResponse.json({ linkInsertion });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to update link insertion");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deleted = await LinkInsertion.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Link insertion not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to delete link insertion");
  }
}

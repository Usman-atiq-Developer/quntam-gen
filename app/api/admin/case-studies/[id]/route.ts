import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import CaseStudy from "@/models/CaseStudy";
import { toApiErrorResponse } from "@/lib/apiError";
import { slugify } from "@/lib/slugify";

const updateSchema = z.object({
  slug: z.string().min(2).optional(),
  client: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  industry: z.string().optional(),
  timeline: z.string().optional(),
  serviceSlug: z.string().optional(),
  tools: z.array(z.string()).optional(),
  title: z.string().min(3).optional(),
  image: z.string().min(1).optional(),
  resultStat: z.string().optional(),
  resultLabel: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  results: z.array(z.string()).optional(),
  quote: z.object({ text: z.string(), author: z.string(), role: z.string() }).optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const caseStudy = await CaseStudy.findById(id).lean();
    if (!caseStudy) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }
    return NextResponse.json({ caseStudy });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load case study");
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
    if (parsed.data.slug) update.slug = slugify(parsed.data.slug);

    const caseStudy = await CaseStudy.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!caseStudy) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }
    return NextResponse.json({ caseStudy });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to update case study");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deleted = await CaseStudy.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to delete case study");
  }
}

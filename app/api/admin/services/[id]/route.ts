import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import Service from "@/models/Service";
import { toApiErrorResponse } from "@/lib/apiError";
import { slugify } from "@/lib/slugify";

const updateSchema = z.object({
  slug: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  shortName: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  oneLiner: z.string().min(5).optional(),
  positioning: z.string().min(5).optional(),
  whatIs: z.string().min(5).optional(),
  theme: z
    .object({ from: z.string(), to: z.string(), tint: z.string(), glow: z.string() })
    .optional(),
  accentIcons: z.array(z.string()).optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  whoFor: z.array(z.string()).optional(),
  quote: z.object({ text: z.string(), author: z.string(), role: z.string() }).optional(),
  process: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  included: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  packages: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        cadence: z.string(),
        description: z.string(),
        features: z.array(z.string()).default([]),
        highlighted: z.boolean().optional(),
      })
    )
    .optional(),
  customQuoteOnly: z.boolean().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  category: z.string().min(1).optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const service = await Service.findById(id).lean();
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ service });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load service");
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

    const service = await Service.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ service });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to update service");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deleted = await Service.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to delete service");
  }
}

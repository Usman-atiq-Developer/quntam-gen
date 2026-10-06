import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import Service from "@/models/Service";
import { toApiErrorResponse } from "@/lib/apiError";
import { slugify } from "@/lib/slugify";
import { escapeRegex } from "@/lib/searchRegex";

const themeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  tint: z.string().min(1),
  glow: z.string().min(1),
});

const serviceSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2, "Name is required"),
  shortName: z.string().min(1, "Short name is required"),
  icon: z.string().min(1).default("Sparkles"),
  oneLiner: z.string().min(5, "One-liner is required"),
  positioning: z.string().min(5, "Positioning is required"),
  whatIs: z.string().min(5, "'What is' description is required"),
  theme: themeSchema,
  accentIcons: z.array(z.string()).default([]),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  whoFor: z.array(z.string()).default([]),
  quote: z.object({ text: z.string(), author: z.string(), role: z.string() }),
  process: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
  included: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
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
    .default([]),
  customQuoteOnly: z.boolean().default(false),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  category: z.string().min(1, "Category is required"),
  published: z.boolean().default(true),
  order: z.number().optional(),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    const query: Record<string, unknown> = {};
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { slug: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const services = await Service.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ services });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load services");
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const order = parsed.data.order ?? (await Service.countDocuments());
    const service = await Service.create({
      ...parsed.data,
      slug: slugify(parsed.data.slug || parsed.data.name),
      order,
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to create service");
  }
}

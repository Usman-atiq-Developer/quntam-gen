import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import CaseStudy from "@/models/CaseStudy";
import { toApiErrorResponse } from "@/lib/apiError";
import { slugify } from "@/lib/slugify";
import { escapeRegex } from "@/lib/searchRegex";

const schema = z.object({
  slug: z.string().min(2),
  client: z.string().min(1, "Client name is required"),
  category: z.string().min(1, "Category is required"),
  industry: z.string().default(""),
  timeline: z.string().default(""),
  serviceSlug: z.string().default(""),
  tools: z.array(z.string()).default([]),
  title: z.string().min(3, "Title is required"),
  image: z.string().min(1, "Image is required"),
  resultStat: z.string().default(""),
  resultLabel: z.string().default(""),
  problem: z.string().default(""),
  solution: z.string().default(""),
  results: z.array(z.string()).default([]),
  quote: z.object({ text: z.string(), author: z.string(), role: z.string() }),
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
        { client: { $regex: safeSearch, $options: "i" } },
        { title: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const caseStudies = await CaseStudy.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ caseStudies });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load case studies");
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

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const order = parsed.data.order ?? (await CaseStudy.countDocuments());
    const caseStudy = await CaseStudy.create({
      ...parsed.data,
      slug: slugify(parsed.data.slug || parsed.data.title),
      order,
    });

    return NextResponse.json({ caseStudy }, { status: 201 });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to create case study");
  }
}

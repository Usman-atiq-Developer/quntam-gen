import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import LinkInsertion from "@/models/LinkInsertion";
import { toApiErrorResponse } from "@/lib/apiError";
import { escapeRegex } from "@/lib/searchRegex";

const STATUSES = ["pending", "approved", "rejected", "live", "completed"] as const;

const createSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email("Enter a valid email address"),
  clientCompany: z.string().optional(),
  targetUrl: z.string().url("Enter a valid URL"),
  anchorText: z.string().min(1, "Anchor text is required"),
  relatedArticle: z.string().optional(),
  relatedPost: z.string().optional(),
  message: z.string().optional(),
  price: z.number().min(0).optional(),
  status: z.enum(STATUSES).default("pending"),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const query: Record<string, unknown> = {};
    if (status && STATUSES.includes(status as (typeof STATUSES)[number])) {
      query.status = status;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { clientName: { $regex: safeSearch, $options: "i" } },
        { clientEmail: { $regex: safeSearch, $options: "i" } },
        { clientCompany: { $regex: safeSearch, $options: "i" } },
        { targetUrl: { $regex: safeSearch, $options: "i" } },
        { anchorText: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const linkInsertions = await LinkInsertion.find(query)
      .populate("relatedPost", "title slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ linkInsertions });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load link insertions");
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

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { relatedPost, ...rest } = parsed.data;
    const linkInsertion = await LinkInsertion.create({
      ...rest,
      relatedPost: relatedPost || undefined,
      source: "admin",
    });

    return NextResponse.json({ linkInsertion }, { status: 201 });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to create link insertion");
  }
}

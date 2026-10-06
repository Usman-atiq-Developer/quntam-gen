import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import SiteFAQ from "@/models/SiteFAQ";
import { toApiErrorResponse } from "@/lib/apiError";
import { escapeRegex } from "@/lib/searchRegex";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    const query: Record<string, unknown> = {};
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { question: { $regex: safeSearch, $options: "i" } },
        { answer: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const faqs = await SiteFAQ.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ faqs });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load FAQs");
  }
}

const createSchema = z.object({
  question: z.string().min(3, "Question is required").max(300),
  answer: z.string().min(3, "Answer is required").max(3000),
  category: z.string().min(1).default("General"),
  showOnHome: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().optional(),
});

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

    // Default new FAQs to the end of the list
    const order = parsed.data.order ?? (await SiteFAQ.countDocuments());
    const faq = await SiteFAQ.create({ ...parsed.data, order });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to create FAQ");
  }
}

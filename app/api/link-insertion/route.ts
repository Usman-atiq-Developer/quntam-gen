import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase, DatabaseConfigError } from "@/lib/db/connect";
import LinkInsertion from "@/models/LinkInsertion";
import { isRateLimited, recordAttempt } from "@/lib/auth/rateLimit";

const schema = z.object({
  clientName: z.string().min(2, "Enter your full name"),
  clientEmail: z.string().email("Enter a valid email address"),
  clientCompany: z.string().optional(),
  targetUrl: z.string().url("Enter a valid URL"),
  anchorText: z.string().min(1, "Anchor text is required"),
  relatedArticle: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  // Own key prefix — isolated from both the login and /api/contact rate
  // limiter buckets (see app/api/contact/route.ts for the same reasoning).
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimitKey = `link-insertion:${ip}`;
  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again in a few minutes." },
      { status: 429 }
    );
  }

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

  try {
    await connectToDatabase();
    await LinkInsertion.create({
      ...parsed.data,
      status: "pending",
      source: "public_form",
    });
  } catch (err) {
    if (err instanceof DatabaseConfigError) {
      console.error("[link-insertion] Database not configured:", err.message);
      return NextResponse.json(
        { error: "This form is temporarily unavailable. Please email us directly instead." },
        { status: 500 }
      );
    }
    console.error("[link-insertion] Failed to save request:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  recordAttempt(rateLimitKey);

  return NextResponse.json({ success: true });
}

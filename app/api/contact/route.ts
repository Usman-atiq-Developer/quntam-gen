import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase, DatabaseConfigError } from "@/lib/db/connect";
import ContactMessage from "@/models/ContactMessage";
import { isRateLimited, recordAttempt } from "@/lib/auth/rateLimit";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  // Prefixed so this shares nothing with the admin-login rate limiter's
  // buckets — flooding the contact form shouldn't affect (or be affected
  // by) login attempts from the same IP, and vice versa. Same generous
  // limit (10 / 15 min) as login: plenty for a real visitor, enough to
  // blunt a naive spam script hitting this public, unauthenticated endpoint.
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimitKey = `contact:${ip}`;
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
    await ContactMessage.create(parsed.data);
  } catch (err) {
    if (err instanceof DatabaseConfigError) {
      console.error("[contact] Database not configured:", err.message);
      return NextResponse.json(
        { error: "The contact form is temporarily unavailable. Please email us directly instead." },
        { status: 500 }
      );
    }
    console.error("[contact] Failed to save message:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  recordAttempt(rateLimitKey);

  // Optional: also send yourself an email notification for every new message.
  //
  // Example with Resend (npm install resend, add RESEND_API_KEY to .env.local):
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "Quntam Gen <notifications@quntamgen.com>",
  //   to: "support@quntamgen.com",
  //   subject: `New inquiry from ${parsed.data.name}`,
  //   text: JSON.stringify(parsed.data, null, 2),
  // });

  return NextResponse.json({ success: true });
}

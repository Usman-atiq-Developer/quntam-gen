import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase, DatabaseConfigError } from "@/lib/db/connect";
import AdminUser from "@/models/AdminUser";
import { verifyPassword } from "@/lib/auth/password";
import { signAdminToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";
import { isRateLimited, recordAttempt, clearAttempts } from "@/lib/auth/rateLimit";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in a few minutes." },
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
  } catch (err) {
    if (err instanceof DatabaseConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  const { email, password } = parsed.data;
  const user = await AdminUser.findOne({ email: email.toLowerCase() });

  // Always run bcrypt.compare, even if no user was found, using a dummy hash.
  // This keeps the response time similar for "unknown email" vs "wrong
  // password" so timing can't be used to enumerate valid admin emails.
  const DUMMY_HASH = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8I0XXbFTUZzT9c1LZ3z6Uu2aVtPXHm";
  const isValid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !isValid) {
    recordAttempt(ip);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  clearAttempts(ip);
  user.lastLoginAt = new Date();
  await user.save();

  const token = await signAdminToken({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  const response = NextResponse.json({
    success: true,
    user: { email: user.email, name: user.name },
  });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days, matches token TTL
  });
  return response;
}

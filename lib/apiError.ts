import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { DatabaseConfigError } from "@/lib/db/connect";

/**
 * Converts common error types thrown by Mongoose/MongoDB (and our own
 * DatabaseConfigError) into a clean, appropriately-coded JSON response.
 * Use this in the catch block of admin API routes so callers always get a
 * useful message instead of a raw stack trace or a generic 500.
 */
export function toApiErrorResponse(err: unknown, fallbackMessage = "Something went wrong"): NextResponse {
  if (err instanceof DatabaseConfigError) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const firstIssue = Object.values(err.errors)[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed", fields: Object.keys(err.errors) },
      { status: 400 }
    );
  }

  if (err instanceof mongoose.Error.CastError) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  // Duplicate key error (e.g. slug/email uniqueness violation)
  if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const field = keyValue ? Object.keys(keyValue)[0] : "field";
    return NextResponse.json({ error: `That ${field} is already in use` }, { status: 409 });
  }

  console.error("[api]", err);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

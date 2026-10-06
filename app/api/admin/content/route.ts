import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import SiteContent from "@/models/SiteContent";
import { toApiErrorResponse } from "@/lib/apiError";

export async function GET() {
  try {
    await connectToDatabase();
    const content = await SiteContent.find().sort({ group: 1, order: 1 }).lean();
    return NextResponse.json({ content });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load site content");
  }
}

const bulkUpdateSchema = z.object({
  updates: z
    .array(
      z.object({
        key: z.string().min(1),
        value: z.string().optional(),
        items: z.array(z.string()).optional(),
      })
    )
    .min(1, "Nothing to update"),
});

/** Bulk-saves edited content values. Used by the "Save changes" button. */
export async function PATCH(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = bulkUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid update" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const ops = parsed.data.updates.map((u) => ({
      updateOne: {
        filter: { key: u.key },
        update: {
          $set: {
            ...(u.value !== undefined ? { value: u.value } : {}),
            ...(u.items !== undefined ? { items: u.items } : {}),
          },
        },
      },
    }));

    const result = await SiteContent.bulkWrite(ops);
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to save content");
  }
}

import { connectToDatabase } from "@/lib/db/connect";
import SiteContentModel from "@/models/SiteContent";
import type { ContentMap } from "@/lib/content-client";

// Re-exported so existing Server Component imports of
// `import { loadContent, text } from "@/lib/content"` keep working
// unchanged. Client Components (and anything rendered from inside a
// Client Component's own module, like Footer via SiteChrome) must import
// `text`/`list`/`ContentMap` from "@/lib/content-client" directly instead —
// importing them from *this* file pulls the mongoose model below into the
// browser bundle and crashes at runtime.
export { text, list, type ContentMap } from "@/lib/content-client";

/**
 * Loads every SiteContent override in one query and returns it as a lookup
 * map. Pages call this once and then resolve individual keys against it,
 * which avoids issuing a separate DB round-trip per editable string.
 *
 * If the database is unreachable (e.g. MONGODB_URI isn't set yet), this
 * returns an empty map rather than throwing — every caller then falls back
 * to its hard-coded default, so the site still renders normally.
 *
 * Server-only: this touches Mongoose/MongoDB directly, so it must never be
 * imported from a Client Component.
 */
export async function loadContent(): Promise<ContentMap> {
  try {
    await connectToDatabase();
    const docs = await SiteContentModel.find().select("key value items").lean();
    const map: ContentMap = {};
    for (const doc of docs) {
      map[doc.key] = { value: doc.value ?? "", items: doc.items ?? [] };
    }
    return map;
  } catch (err) {
    console.warn(
      "[lib/content] Falling back to default copy — database unavailable:",
      err instanceof Error ? err.message : err
    );
    return {};
  }
}

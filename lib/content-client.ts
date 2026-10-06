/**
 * Pure helpers for resolving editable content values. Deliberately has ZERO
 * imports from mongoose, models, or lib/db/connect — those pull Node-only
 * code into the bundle, which breaks if this file is ever imported (even
 * for a single named export) from a Client Component, since bundlers
 * include a whole module's import graph, not just the parts you use.
 *
 * `loadContent()` (the actual database read) lives in lib/content.ts, which
 * re-exports everything here for convenience in Server Components. Client
 * Components — and any Server Component that gets rendered from inside a
 * Client Component's own module (e.g. Footer, rendered from SiteChrome) —
 * must import from *this* file instead of "@/lib/content".
 */

export type ContentMap = Record<string, { value: string; items: string[] }>;

/**
 * Resolves a single text/image value, falling back to the original
 * hard-coded copy when the key has never been edited in the dashboard.
 */
export function text(map: ContentMap, key: string, fallback: string): string {
  const entry = map[key];
  if (!entry) return fallback;
  const value = entry.value?.trim();
  return value ? value : fallback;
}

/**
 * Resolves a list value (e.g. a set of bullet points), falling back to the
 * original hard-coded array when it hasn't been edited.
 */
export function list(map: ContentMap, key: string, fallback: string[]): string[] {
  const entry = map[key];
  if (!entry) return fallback;
  const items = (entry.items ?? []).map((i) => i.trim()).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

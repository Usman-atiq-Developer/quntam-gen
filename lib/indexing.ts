/**
 * Global, site-wide search-engine indexing switch.
 *
 * This is deliberately separate from the per-post `robotsIndex` field on
 * the Post model (see models/Post.ts, lib/posts.ts) — the two compose
 * rather than duplicate each other:
 *
 *   - This flag is the master switch for the ENTIRE site (every public
 *     page: home, services, portfolio, blog, etc.). Flip it off and
 *     nothing on the site is indexable, regardless of any per-post setting.
 *   - `robotsIndex` is a per-post override that only matters once this
 *     master switch is on — it lets an individual published blog post be
 *     excluded from indexing while the rest of the site is indexable.
 *
 * A post is actually indexable only when BOTH are true:
 *   INDEXING_ENABLED && post.robotsIndex !== false
 * (see app/blog/[slug]/page.tsx and lib/posts.ts's getIndexableSlugs()).
 *
 * Read via `NEXT_PUBLIC_INDEXING_ENABLED` rather than a server-only name:
 * every place that actually enforces this (app/layout.tsx's metadata,
 * app/blog/[slug]/page.tsx's metadata, next.config.mjs's headers()) runs
 * server-side only in Next.js regardless of the NEXT_PUBLIC_ prefix, so
 * there's no functional downside — and the prefix leaves the door open to
 * also surface the current state in a client component later (e.g. an
 * admin-dashboard banner) without needing a second variable.
 *
 * Defaults to `false` (NOT indexed) when unset, which is the safe,
 * conservative choice for a freshly deployed site that hasn't explicitly
 * opted in to being indexed yet — an operator who forgets to set this
 * variable at all gets "quietly not indexed," never "accidentally
 * indexed."
 */
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";

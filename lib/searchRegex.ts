/**
 * Escapes regex special characters in user-supplied search text before it's
 * used inside a MongoDB `$regex` filter.
 *
 * Every admin list/search endpoint (posts, services, case studies, FAQs,
 * link insertions, contact messages) builds a case-insensitive "contains"
 * search by dropping the raw `?search=` query string straight into
 * `{ $regex: search, $options: "i" }`. Without escaping, a crafted search
 * string with a catastrophic-backtracking pattern (e.g. `(a+)+$`) can make
 * MongoDB's regex engine hang on that query — a ReDoS. Escaping first means
 * the search term is always treated as a literal substring, which is what
 * every caller actually intends (nobody is typing real regex syntax into a
 * search box on purpose).
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

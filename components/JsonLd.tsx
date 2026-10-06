/**
 * Renders one or more JSON-LD blocks. `<` is escaped to its unicode form so
 * that admin-editable text (titles, FAQs, excerpts) can never close the
 * <script> tag early — a small but real XSS/markup-break hardening.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

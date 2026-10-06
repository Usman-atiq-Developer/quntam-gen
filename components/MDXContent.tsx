import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { PluggableList } from "unified";
import { slugifyHeading } from "@/lib/posts";

/**
 * Blog posts are authored by admins, but "authored by a trusted role" is
 * not the same as "safe to render as-is" — an admin account can be
 * compromised, and post content is sometimes pasted in from external
 * sources (freelancers, AI tools) without every character being reviewed.
 * A CMS should sanitize rendered content regardless of who wrote it.
 *
 * `format: "md"` tells the MDX compiler to treat HTML-looking tags in the
 * source as literal raw HTML (not as arbitrary JSX/components) — the
 * default `format: "mdx"` behavior otherwise compiles something like
 * `<script>` straight into a real `React.createElement("script", ...)`
 * call, which browsers DO execute once it lands in the DOM. `rehype-raw`
 * then parses that raw HTML into a structured tree, and `rehype-sanitize`
 * strips anything not on its (deliberately conservative) allowlist —
 * `<script>` tags, `on*` event handler attributes, `javascript:` URLs,
 * `<iframe>`/`<object>`/`<embed>`, inline `<style>`, and so on — before any
 * of it is compiled into what actually reaches a visitor's browser.
 *
 * `remarkGfm` adds GitHub-Flavored-Markdown support — tables, ~~strikethrough~~,
 * task lists, and autolinked bare URLs. Plain CommonMark (what remark parses
 * by default, without this plugin) does NOT understand pipe-table syntax at
 * all: a table in the source was previously collapsing into a single
 * plain-text paragraph on the live page, because the parser genuinely had
 * no rule for it — this was the root cause of "tables render as plain
 * text on the live site." The admin editor's Preview tab never showed this
 * bug because it renders through a *different* parser (marked.js, with
 * `{ gfm: true }` already set in MarkdownEditor.tsx) that has always
 * understood tables — so preview and live were silently running two
 * parsers with different capabilities. Adding remarkGfm here brings the
 * live page in line with what the editor's preview already does.
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Needed so a checked GFM task-list item (`- [x] Done`) renders as
    // actually checked — the default schema allows the checkbox itself
    // but drops its `checked` attribute, silently turning every checked
    // box into an unchecked one.
    input: [...(defaultSchema.attributes?.input ?? []), "checked"],
  },
};

const mdxOptions = {
  format: "md" as const,
  remarkPlugins: [remarkGfm] as PluggableList,
  rehypePlugins: [rehypeRaw, [rehypeSanitize, sanitizeSchema]] as PluggableList,
};

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textFromChildren((children as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

/** True for a GFM task-list `<li class="task-list-item">` — these already
 * carry their own checkbox as the visual marker, so the component below
 * skips its usual red-dot bullet to avoid showing two markers on one line. */
function isTaskListItem(props: { className?: string }): boolean {
  return typeof props.className === "string" && props.className.includes("task-list-item");
}

const components = {
  // Blog post pages already render exactly one <h1> (the title, outside
  // this component). If the body content also contains a Markdown `#`
  // heading, rendering a second real <h1> would hurt both SEO (duplicate
  // top-level heading) and accessibility (heading outline no longer makes
  // sense). Demoting it to an <h2> — visually consistent with the rest of
  // the article's heading hierarchy — keeps a single, correct H1 per page
  // without silently dropping content the author wrote.
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugifyHeading(textFromChildren(props.children));
    return (
      <h2 id={id} className="scroll-mt-28 flex items-baseline gap-3 text-h3 mt-14 mb-5">
        <span className="h-6 w-1 shrink-0 translate-y-1 rounded-full bg-brand-gradient" aria-hidden="true" />
        <span {...props} />
      </h2>
    );
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugifyHeading(textFromChildren(props.children));
    return (
      <h2 id={id} className="scroll-mt-28 flex items-baseline gap-3 text-h3 mt-14 mb-5">
        <span className="h-6 w-1 shrink-0 translate-y-1 rounded-full bg-brand-gradient" aria-hidden="true" />
        <span {...props} />
      </h2>
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugifyHeading(textFromChildren(props.children));
    return <h3 id={id} className="scroll-mt-28 text-xl font-semibold mt-9 mb-3" {...props} />;
  },
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugifyHeading(textFromChildren(props.children));
    return <h4 id={id} className="scroll-mt-28 text-lg font-semibold text-ink-heading mt-7 mb-2.5" {...props} />;
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-ink-body leading-[1.85] mb-5" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Autolinked/external URLs (http/https, not a same-site relative link)
    // open in a new tab so a reader doesn't lose their place mid-article —
    // internal links (e.g. /services/seo) navigate normally in the same tab.
    const isExternal = typeof props.href === "string" && /^https?:\/\//.test(props.href);
    return (
      <a
        className="text-brand-start font-medium underline decoration-brand-end/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-brand-end break-words"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-6 space-y-3 text-ink-body" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="my-6 space-y-3 text-ink-body list-decimal marker:font-semibold marker:text-brand-start pl-5" {...props} />
  ),
  li: ({ children, ...rest }: React.LiHTMLAttributes<HTMLLIElement>) => {
    if (isTaskListItem(rest)) {
      // The checkbox itself (rendered via the `input` component below) is
      // this item's marker — no extra bullet on top of it.
      return (
        <li {...rest} className="flex items-start gap-2.5 leading-relaxed list-none -ml-5">
          {children}
        </li>
      );
    }
    return (
      <li className="flex items-start gap-3 leading-relaxed" {...rest}>
        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient" aria-hidden="true" />
        <span>{children}</span>
      </li>
    );
  },
  input: (props: React.InputHTMLAttributes<HTMLInputElement>) =>
    props.type === "checkbox" ? (
      <input {...props} disabled className="mt-1.5 h-4 w-4 shrink-0 accent-brand-start" />
    ) : null,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="text-ink-heading font-semibold" {...props} />,
  del: (props: React.HTMLAttributes<HTMLElement>) => <del className="text-ink-muted" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-8 rounded-r-xl border-l-4 border-brand-start bg-surface2 py-4 pl-6 pr-4 text-lg italic text-ink-heading [&>p]:mb-0"
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // Blog images come from Cloudinary (already optimised and CDN-served), so
    // a plain <img> with lazy loading is appropriate here — next/image needs
    // known dimensions, which Markdown doesn't provide.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      loading="lazy"
      decoding="async"
      className="my-8 w-full rounded-xl2 border border-border shadow-card"
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  // Fenced code blocks (```...```) compile to <pre><code>...</code></pre>.
  // This wraps that in a horizontally-scrollable, dark, rounded container —
  // long lines scroll inside the block instead of overflowing/breaking the
  // page layout on mobile. The nested `code` component below detects it's
  // inside a block (vs. inline `` `code` ``) and drops its own pill
  // background so the two don't visually double up.
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="not-prose my-8 overflow-x-auto rounded-xl2 border border-borderdark bg-basedark px-5 py-4 text-[0.9em] leading-relaxed text-white/90 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit [&_code]:font-normal"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded-md bg-surface2 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-start" {...props} />
  ),
  // GFM tables — wrapped in its own overflow-x-auto container (rather than
  // relying on the article width) so a wide table scrolls horizontally on
  // narrow screens instead of squeezing every column unreadably thin or
  // breaking the page's own layout.
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full min-w-[480px] border-collapse text-left text-[0.95em]" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-surface2" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-border" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-border last:border-0" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-ink-heading whitespace-normal align-bottom" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-ink-body align-top whitespace-normal" {...props} />
  ),
};

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="article-content prose prose-brand max-w-none text-body">
      <MDXRemote source={source} components={components} options={{ mdxOptions }} />
    </div>
  );
}

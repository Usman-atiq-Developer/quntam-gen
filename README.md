# Quntam Gen — Website & Admin Dashboard

A full marketing website for Quntam Gen, built with Next.js 14 (App Router),
Tailwind CSS, Framer Motion, MongoDB Atlas, and a custom admin dashboard
(blog CMS, contact message inbox, and link-insertion management).

## Tech stack (and why)

- **Next.js 14 (App Router)** — SSR/SSG for SEO and performance, file-based routing, built-in
  image optimization, sitemap/robots generation.
- **MongoDB Atlas + Mongoose** — stores blog posts, contact messages, link insertion
  requests, and the admin account. Replaces the old MDX-file blog and the old
  "contact form just logs to console" behavior.
- **Custom JWT + httpOnly cookie authentication** — protects `/admin/**` and
  `/api/admin/**`. No third-party auth service required.
- **Tailwind CSS** — utility-first styling, configured with the brand's exact design tokens
  (colors, type scale, easing curves) in `tailwind.config.ts`.
- **Framer Motion** — component and page-level animation (mega-menu, cards, counters,
  accordions, carousels).
- **React Hook Form + Zod** — client-side validated forms (contact, link insertion), with the
  same validation re-run server-side in the API routes.
- **Vercel** — zero-config deploys for Next.js; see the deployment section below.

---

## 1. Configure MongoDB Atlas

1. Create a free account/cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. **Database Access** → add a database user with a username/password (not your Atlas login).
3. **Network Access** → add an IP entry. For local development, add your current IP. For
   Vercel, add `0.0.0.0/0` (allow from anywhere) since Vercel's serverless functions don't
   have static IPs — Atlas auth (username/password) is still required, so this is standard
   practice, not a security hole.
4. **Database → Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Add a database name to the path so all your collections land in one place, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/quntamgen?retryWrites=true&w=majority
   ```
   That full string is your `MONGODB_URI`.

No manual collection/schema setup is needed — Mongoose creates collections (`adminusers`,
`contactmessages`, `posts`, `linkinsertions`) automatically the first time each is written to.

---

## 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | Your Atlas connection string from step 1. |
| `JWT_SECRET` | Yes | Signs admin session tokens. Generate with `openssl rand -base64 32`. Must be at least 16 characters (32+ recommended). |
| `ADMIN_EMAIL` | Only for `npm run seed:admin` | Email for the admin account being created. |
| `ADMIN_PASSWORD` | Only for `npm run seed:admin` | Password for the admin account (min 8 characters). Only used once, at seed time. |
| `ADMIN_NAME` | Optional | Display name shown in the dashboard. Defaults to "Admin". |
| `RESEND_API_KEY` | Optional | Only if you wire up email notifications in `app/api/contact/route.ts` (commented-out example included). |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 measurement ID. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional | Google Search Console verification meta tag. |

On Vercel, add the same variables under **Project Settings → Environment Variables**
(you don't need `ADMIN_EMAIL`/`ADMIN_PASSWORD` there long-term — see step 4).

---

## 3. Run the project locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

---

## 4. Create your admin account

With `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` set in `.env.local`, run:

```bash
npm run seed:admin
```

This creates (or updates, if it already exists) an `AdminUser` document with a bcrypt-hashed
password. Re-run it any time to reset a forgotten password — it's safe, it upserts by email.

Then sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

**Note:** `ADMIN_EMAIL`/`ADMIN_PASSWORD` are only read by this one script — they are not used
anywhere else in the app at runtime, and you don't need to keep them set in production once
the account exists (though leaving them in Vercel's env vars so you can re-run the script
later to reset your password is fine and safe).

---

## 5. Migrate the existing blog posts

The blog used to be 3 MDX files in `content/posts/`. It's now MongoDB-backed. Run this once:

```bash
npm run migrate:posts
```

This reads all `.mdx` files in `content/posts/`, preserves every field (title, excerpt,
category, cover image, author, date, takeaways, FAQs, and the full article body), and inserts
them into MongoDB as **published** posts. It's safe to re-run — posts are upserted by slug, so
running it twice won't create duplicates. Your original `.mdx` files are left untouched in
`content/posts/` as a backup; they're no longer read by the site, so you can delete them later
if you want.

After migrating, go to `/admin/blog` and confirm all 3 posts appear with their original
content intact, then spot-check the public pages at `/blog` and `/blog/<slug>`.

---

## 6. What's in the admin dashboard (`/admin`)

- **Overview** — live counts: total/unread messages, published/draft posts, pending/total
  link insertions, plus a feed of the 5 most recent messages and link requests.
- **Messages** — every contact form submission. Filter by status (new/read/archived), search
  by name/email/message text, expand to read the full message, reply via `mailto:`, archive,
  or delete.
- **Blog** — full CMS: create, edit, delete, save as draft, or publish. Fields include title,
  auto-generated (editable) slug, excerpt, Markdown content, category, tags, cover image, author
  name/role, SEO title, meta description, key takeaways, and FAQs.
- **Link Insertions** — one system that covers both the public request queue and full
  management: client name/email/company, target URL, anchor text, a free-text "related
  article" reference plus an optional link to one of your own published posts, price, status
  (pending/approved/rejected/live/completed), and internal notes. Search, filter by status,
  create entries directly (for insertions you're managing that didn't come through the public
  form), edit, or delete.

All `/admin/**` pages and `/api/admin/**` routes are protected by `middleware.ts` — visiting
them without a valid session redirects to `/admin/login` (or returns 401 for API calls).
`/admin` is also excluded from the sitemap and disallowed in `robots.ts`.

---

## 7. Public-facing additions

- **Contact form** (`/contact`) now saves every submission to MongoDB instead of just logging
  it — nothing changed in the UI, only what happens on submit.
- **Link Insertion request form** (`/link-insertion`) — new public page where clients can
  request a link placement (target URL, anchor text, related article, optional message).
  Submissions land in the admin dashboard with status "pending". Linked from the footer.

---

## 8. Testing checklist

Run through this after setting up your `.env.local`:

1. **Build & types**
   ```bash
   npm run build
   ```
   Should complete with no errors (already verified against this codebase before delivery).

2. **Admin authentication**
   - Visit `/admin` while logged out → should redirect to `/admin/login`.
   - Log in with wrong credentials → should show "Invalid email or password".
   - Log in with correct credentials → should land on the Overview page.
   - Refresh the page → session should persist (httpOnly cookie).
   - Click **Log out** → should redirect to `/admin/login`, and `/admin` should redirect again.

3. **Contact form** (`/contact`)
   - Submit with an invalid email → client-side validation should block it.
   - Submit a valid message → should show the success state, and the message should appear in
     `/admin/messages` with status "new".

4. **Blog CRUD** (`/admin/blog`)
   - Create a new post, save as draft → confirm it does **not** appear on the public `/blog`
     listing or `/blog/<slug>`.
   - Edit the same post and click Publish → confirm it now appears on `/blog` and at its slug
     URL, with correct title/excerpt/content/cover image.
   - Confirm it appears in `/blog/feed.xml` and `/sitemap.xml`.
   - Delete a post → confirm it disappears from both the admin list and the public site.

5. **Link insertion flow**
   - Submit the public form at `/link-insertion` → confirm it appears in
     `/admin/link-insertions` with status "pending" and source "form".
   - Open it, set a price, change status to "approved", add a note, save → confirm the changes
     persist on reload.
   - Create a new one directly from `/admin/link-insertions/new` → confirm it's tagged as
     admin-sourced (no "form" badge).

6. **Database error handling** — temporarily rename/remove `MONGODB_URI` from `.env.local` and
   restart the dev server:
   - The public blog pages should still render (empty state) instead of crashing.
   - The contact form and link-insertion form should show a friendly error instead of a stack
     trace.
   - The admin login page should show a clear "MONGODB_URI is not set" error rather than a
     generic 500.

> **Note on this delivery:** this build was fully implemented, type-checked (`tsc --noEmit`),
> linted (`next lint`), and production-built (`next build`) successfully, and all logic that
> doesn't require a live database (password hashing, JWT signing/verification, slug generation,
> Zod validation schemas, Mongoose schema validation, and MDX frontmatter parsing for the
> migration script) was tested directly. The sandbox this was built in has no network access to
> MongoDB Atlas or a downloadable local MongoDB binary, so the *live* end-to-end flows above
> (actually reading/writing through a real database) should be run once by you locally with a
> real `MONGODB_URI` before considering the project fully verified. If anything in the checklist
> above doesn't behave as described, let me know and I'll fix it.

---

## 9. Deploying to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In Vercel, **Add New Project** → import the repo. Framework preset "Next.js" is
   auto-detected.
3. Under **Environment Variables**, add `MONGODB_URI` and `JWT_SECRET` at minimum (plus any
   optional ones from the table in step 2). Use a different `JWT_SECRET` than local dev.
4. Deploy.
5. After the first deploy, run `npm run seed:admin` **locally** (pointed at the same
   `MONGODB_URI` as production — i.e. your `.env.local` should have the production connection
   string when you run this) to create the admin account in the production database. You only
   need to do this once; the account lives in MongoDB, not in Vercel.
6. Run `npm run migrate:posts` the same way (also only needs to happen once, against whichever
   database your production site points to).
7. Visit `https://your-domain.com/admin/login` and sign in.

**MongoDB Network Access reminder:** make sure Atlas's Network Access list includes `0.0.0.0/0`
(or Vercel's IP ranges, which change) — otherwise Vercel's serverless functions will fail to
connect with a timeout, not a clear error.

---

## Project structure

```
app/
  admin/                Admin dashboard (protected by middleware.ts)
    (dashboard)/         Authenticated pages: overview, messages, blog, link-insertions
    login/                Public login page
  api/
    admin/                Protected admin API routes (messages, posts, link-insertions, auth, stats)
    contact/              Public contact form endpoint (now saves to MongoDB)
    link-insertion/        Public link-insertion request endpoint
  blog/, blog/[slug]/     Public blog (now reads from MongoDB via lib/posts.ts)
  link-insertion/         Public link-insertion request page
  services/[slug]/        Dynamic service pages
  portfolio/[slug]/       Dynamic case-study pages
components/
  admin/                  Admin-only UI (tables, editors, sidebar, badges)
  ...                     Shared public-site UI components
  SiteChrome.tsx          Hides the public navbar/footer/widgets on /admin routes
lib/
  auth/                   Password hashing, JWT, session helpers, login rate limiting
  db/connect.ts           Cached Mongoose connection singleton
  posts.ts                Blog data layer (MongoDB-backed)
  slugify.ts, apiError.ts  Shared utilities
models/                  Mongoose schemas: AdminUser, ContactMessage, Post, LinkInsertion
scripts/
  create-admin.ts         npm run seed:admin
  migrate-posts.ts        npm run migrate:posts
middleware.ts             Protects /admin/** and /api/admin/**
content/posts/            Original MDX posts (kept as backup, no longer read by the site)
data/                     Services & case study content (unchanged, still hard-coded)
docs/                     Publishing & deployment guides
public/images/            Logo, blog covers, portfolio, and team imagery
```

## Editing content

- **Services** (pricing, process, stats, "who this is for", FAQs, etc.): `data/services.ts`
- **Case studies**: `data/caseStudies.ts`
- **Blog posts**: now managed at `/admin/blog` — see section 6 above. `docs/HOW-TO-PUBLISH-A-BLOG-POST.md`
  has been updated to point here.
- **Team & testimonials**: `app/about/page.tsx` and `components/Testimonials.tsx`
- **Brand colors/fonts**: `tailwind.config.ts`.

## Before going live

- [ ] Set `MONGODB_URI` and `JWT_SECRET` in Vercel's production environment variables.
- [ ] Run `npm run seed:admin` and `npm run migrate:posts` against your production database.
- [ ] Replace placeholder team photos, blog covers, and portfolio images in `public/images/`.
- [ ] Update phone number, email, and address in `components/Footer.tsx` and `app/contact/page.tsx`.
- [ ] Set real social links in `components/Footer.tsx` and `app/contact/page.tsx`.
- [ ] Wire up `app/api/contact/route.ts` to Resend (or your email/CRM provider) if you want
      email notifications in addition to the admin dashboard inbox — see the commented example
      in that file.
- [ ] Add your GA4 measurement ID and connect Search Console.
- [ ] Confirm `siteUrl` in `app/layout.tsx` and `app/sitemap.ts` matches your real domain.
- [ ] Confirm MongoDB Atlas Network Access allows Vercel's connections (`0.0.0.0/0`).
- [ ] Run `npm run build` locally once more before deploying to catch any issues early.
- [ ] Log into `/admin` on production once to confirm the full auth flow works end-to-end.

---

## 10. Editing site content from the dashboard

After running the content seed once:

```bash
npm run seed:content
```

...your existing services, case studies, FAQs, and page copy are imported into MongoDB and
become editable at `/admin`. Re-running it is safe — it skips anything that already exists so
your dashboard edits are never overwritten. Use `npm run seed:content -- --force` only if you
want to reset everything back to the original hard-coded copy.

**New dashboard sections:**

- **Site Content** (`/admin/content`) — every editable headline, paragraph, button label, and
  contact detail across the site, grouped by page and searchable. Edit as many fields as you
  like, then hit **Save changes** once. Edited fields are highlighted and each has an **Undo**.
- **FAQs** (`/admin/faqs`) — create, edit, delete, reorder (arrows), publish/unpublish, and
  toggle whether each FAQ also appears on the home page.
- **Services** (`/admin/services`) — full control over every service: name, slug, icon,
  one-liner, positioning, "what is" explainer, theme gradient colours (with a live preview),
  stats, who-it's-for list, what's-included, benefits, tools, process steps, pricing packages
  (with features and a "most popular" highlight), client quote, and per-service FAQs. Add new
  services, reorder them with the arrows, and publish/unpublish without deleting.
- **Case Studies** (`/admin/case-studies`) — manage your portfolio: client, headline, cover
  image (drag-and-drop upload), industry, timeline, linked service, headline result stat,
  problem/solution write-ups, results list, tools, and client quote.

**How the fallback works:** every public page reads its copy from MongoDB but falls back to the
original hard-coded text if a key hasn't been edited or the database is unreachable. This means
the site can never render blank because of a missing content row, and it keeps working even
before you run the seed.

**To make a new piece of text editable:** add an entry to `scripts/content-seed-data.ts`, then
use `text(content, "your.key", "the current default")` at the matching spot in the page. Re-run
`npm run seed:content` and it'll appear in the dashboard.

---

## 11. Image uploads (Cloudinary)

Images are hosted on Cloudinary rather than in the repo, because Vercel's filesystem is
read-only at runtime — anything uploaded to disk in production would vanish on the next deploy.

### Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. On the dashboard home page, find **Product Environment Credentials**.
3. Copy the three values into `.env.local` (and into Vercel's environment variables):
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your-api-secret
   CLOUDINARY_FOLDER=quntam-gen
   ```

Your API secret is only ever read **server-side** — uploads go through the admin-protected
`/api/admin/upload` route rather than straight from the browser, so credentials are never
exposed to visitors.

### Where you can upload

- **Blog cover image** — drag and drop (or click to browse) in the post editor sidebar.
- **Inside blog articles** — click **Insert image** above the content box. The image uploads
  and the Markdown is inserted *at your cursor position*, so it lands exactly where you want it.
- **Site Content** — any field marked as an image type gets the same drag-and-drop uploader.

Every uploader also accepts a pasted URL or a `/images/...` path, so existing images in
`public/` keep working exactly as before.

Uploads are limited to 8 MB and must be JPG, PNG, WebP, AVIF, GIF, or SVG. Cloudinary
automatically serves each visitor the most efficient format and quality for their browser
(`fetch_format: auto`, `quality: auto`), so large photos won't slow your pages down.

`res.cloudinary.com` is already whitelisted in `next.config.mjs` (`images.remotePatterns`) and
allowed by the site's Content Security Policy, so no extra configuration is needed.

---

## 12. Writing blog posts — the easier way

The blog editor (`/admin/blog/new` and edit pages) now includes:

- **Category picker** — click the Category field to see every category already used across your
  posts, pick one, or type a new name and click "Create" to add it on the spot. There's no
  separate category list to manage — a category exists as soon as a post uses it.
- **Markdown toolbar** — Bold, Italic, Heading, Subheading, Bullet list, Numbered list, Quote,
  Inline code, Link, **Table** (inserts a ready-to-edit 3-column table), Divider, and Image
  (uploads to Cloudinary and inserts it at your cursor). Select text first to apply formatting
  to it, or click with nothing selected to insert a placeholder you can type over.
- **Write / Preview tabs** — switch to Preview to see roughly how the formatted article will
  look before publishing.
- **SEO fields** — Search Intent (informational / commercial / transactional / navigational),
  Primary Keyword, and Secondary Keywords, alongside the existing SEO Title and Meta
  Description. These are for your own reference and future SEO tooling — they don't currently
  change anything on the public page automatically, but are stored on every post and available
  via the API if you want to build reporting around them later.

You still don't need to know Markdown syntax to use the editor, but everything you write is
saved as plain Markdown under the hood — the same format the blog has always used.

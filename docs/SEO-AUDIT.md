# SEO Audit — Quntam Gen (checklist vs project)

## Launch se pehle ZAROORI (sab se important)
1. Hosting ma env var set karo: `NEXT_PUBLIC_INDEXING_ENABLED=true`, phir **rebuild/redeploy**.
   Warna poori site `noindex` rahegi aur sitemap khali hogi (yeh project ka pre-launch safety switch hai).
2. `NEXT_PUBLIC_SITE_URL=https://quntamgen.com` set karo.
3. `NEXT_PUBLIC_GSC_VERIFICATION` (Search Console) aur `NEXT_PUBLIC_GA_ID` (GA4) set karo.
4. Deploy ke baad Search Console ma `https://quntamgen.com/sitemap.xml` submit karo.
5. `www` ko DNS ma point karo (redirect pehle se code ma hai).

## Is round ma kya ADD / FIX hua
| Checklist section | Change |
|---|---|
| 2 Titles | Generic titles (About/Contact/FAQs/Pricing/Services/Portfolio/Blog) ko keyword-rich banaya |
| 5/15 Technical | Blog index ka canonical + OG + Twitter missing tha, ab `pageMetadata()` se aata hai |
| 10 Security | HSTS + Permissions-Policy headers; JSON-LD ab `<` escape karta hai (`components/JsonLd.tsx`) |
| 14 Speed | `/images` par long cache headers, `minimumCacheTTL` |
| 11 Images | Blog cover / case-study OG image ab absolute URL (Cloudinary URL pehle `siteUrl + url` ban ke toot jata) |
| 20 Schema | Organization (+ProfessionalService, contactPoint, foundingDate, knowsAbout), WebSite (@id, publisher), BlogPosting (dateModified, publisher+logo, wordCount, author url), BreadcrumbList (blog, about, contact, pricing, service/case-study fix), AboutPage/ContactPage/CollectionPage/WebPage |
| 20 Schema fix | Fake `SearchAction` hata diya (blog `?search=` URL support nahi karta tha — misleading schema) |
| 22 Sitemap | Har URL par `lastModified: new Date()` (jhoota) hata diya; blog posts ka real update date |
| 23 Robots | `/api/` disallow add |
| 24 Social | `og:locale`, article `modifiedTime/authors/section/tags`, Twitter title consistent |
| 12/13 PWA/Mobile | `manifest.webmanifest`, `theme-color`, proper favicon.ico + icon.png + apple-icon.png |
| 36 Blog | RSS feed: `atom:link`, `lastBuildDate`, `dc:creator`, sahi content-type; RSS autodiscovery har page par |
| 25 E-E-A-T | `/.well-known/security.txt`, `llms.txt` (AI crawlers ke liye site summary) |

## Pehle se theek tha
Unique canonicals, per-post noindex toggle, sitemap + robots, Next/Image + AVIF/WebP, FAQ/Service/Breadcrumb schema,
visible breadcrumbs, skip-link, `lang="en"`, www → non-www redirect, CSP headers, RSS, internal linking (related posts/services).

## Aap ko khud karna hai (code se nahi ho sakta)
- **Keyword research (section 1):** har page ka primary keyword Ahrefs/Semrush/GSC se decide karo, titles uske hisaab se tune karo.
- **Content (6, 8, 25):** blog posts abhi sirf 3 hain — 10–15 quality posts likho; real author bio/photo; testimonials sirf asli clients ke.
- **Local SEO (33):** abhi site ma physical address/phone nahi hai, is liye LocalBusiness schema nahi lagaya (jhoota schema penalty deta hai). Address ho to Google Business Profile bana ke batao, schema add kar dunga.
- **Testing (38–40):** deploy ke baad PageSpeed Insights, Rich Results Test, aur URL Inspection chalao.
- **Stats:** services page par "50+ projects / 98% satisfaction" — sirf tab rakho jab yeh sach ho.
- **Build note:** `next/font/google` build ke waqt internet chahta hai — hosting par theek chalega.

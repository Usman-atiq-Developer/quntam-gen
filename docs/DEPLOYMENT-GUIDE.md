# Deployment Guide — Vercel + Custom Domain

## 1. Push the project to GitHub

```bash
cd quntam-gen
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/your-username/quntam-gen.git
git branch -M main
git push -u origin main
```

## 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) and sign up or log in (GitHub login is easiest).
2. Click **Add New → Project**.
3. Select your `quntam-gen` repository.
4. Vercel auto-detects Next.js — leave the default build settings as-is:
   - Build command: `next build`
   - Output directory: (default, leave blank)
5. Add environment variables (copy from `.env.local.example`), e.g. `RESEND_API_KEY`,
   `NEXT_PUBLIC_GA_ID`, if you're using them.
6. Click **Deploy**. Your first build takes 1–3 minutes.

You'll get a live URL like `quntam-gen.vercel.app` immediately.

## 3. Connect your custom domain

1. In your Vercel project, go to **Settings → Domains**.
2. Add `quntamgen.com` (and `www.quntamgen.com`).
3. Vercel will show you DNS records to add at your domain registrar (GoDaddy, Namecheap,
   Google Domains, etc.):
   - Usually an **A record** pointing `@` to Vercel's IP, and a **CNAME record** pointing
     `www` to `cname.vercel-dns.com`.
4. Add those records in your registrar's DNS settings.
5. Wait for DNS propagation (a few minutes to a few hours). Vercel automatically issues a free
   SSL certificate once it verifies the domain — no extra steps needed.

## 4. Set your production URL

Once your domain is live, open `app/layout.tsx` and `app/sitemap.ts` and confirm `siteUrl`
matches your real domain exactly (including `https://` and no trailing slash).

## 5. Connect Google Search Console & Analytics

1. **Search Console**: [search.google.com/search-console](https://search.google.com/search-console) →
   Add property → verify via the DNS method (or the HTML tag method using
   `NEXT_PUBLIC_GSC_VERIFICATION` in your env variables). Submit `https://yourdomain.com/sitemap.xml`.
2. **Analytics 4**: create a GA4 property at [analytics.google.com](https://analytics.google.com),
   grab your Measurement ID (starts with `G-`), and set it as `NEXT_PUBLIC_GA_ID` in Vercel's
   environment variables, then redeploy.

## 6. Every future update

Any time you push to `main` (including new blog posts — see
`docs/HOW-TO-PUBLISH-A-BLOG-POST.md`), Vercel automatically rebuilds and redeploys. Pull
requests get their own preview URL automatically, so you can review changes before merging.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

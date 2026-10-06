/**
 * Imports all existing hard-coded site content into MongoDB so it becomes
 * editable from the admin dashboard:
 *
 *   - data/services.ts      -> Service documents (incl. packages + per-service FAQs)
 *   - data/caseStudies.ts   -> CaseStudy documents
 *   - general site FAQs     -> SiteFAQ documents
 *   - key page copy         -> SiteContent documents (hero headline, CTAs, etc.)
 *
 * Safe to re-run: everything is upserted by its natural key (slug/question/key),
 * so running it twice won't create duplicates. It will NOT overwrite edits you've
 * already made in the dashboard unless you pass --force.
 *
 * Run with:
 *   npm run seed:content
 *   npm run seed:content -- --force   (re-import and overwrite existing docs)
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { services as seedServices } from "../data/services";
import { caseStudies as seedCaseStudies } from "../data/caseStudies";
import ServiceModel from "../models/Service";
import CaseStudyModel from "../models/CaseStudy";
import SiteFAQModel from "../models/SiteFAQ";
import SiteContentModel from "../models/SiteContent";
import { SITE_CONTENT_SEED } from "./content-seed-data";
import { GENERAL_FAQ_SEED } from "./faq-seed-data";

const FORCE = process.argv.includes("--force");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in .env.local. See .env.local.example.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(`Connected to MongoDB.${FORCE ? " (--force: existing docs will be overwritten)" : ""}\n`);

  // ── Services ──────────────────────────────────────────────────────
  let sCreated = 0;
  let sSkipped = 0;
  for (const [i, svc] of seedServices.entries()) {
    const existing = await ServiceModel.findOne({ slug: svc.slug });
    if (existing && !FORCE) {
      sSkipped += 1;
      continue;
    }
    const doc = {
      ...svc,
      accentIcons: [...svc.accentIcons],
      customQuoteOnly: svc.customQuoteOnly ?? false,
      published: true,
      order: i,
    };
    if (existing) {
      Object.assign(existing, doc);
      await existing.save();
    } else {
      await ServiceModel.create(doc);
    }
    sCreated += 1;
  }
  console.log(`Services:     ${sCreated} imported, ${sSkipped} already existed (skipped)`);

  // ── Case studies ──────────────────────────────────────────────────
  let cCreated = 0;
  let cSkipped = 0;
  for (const [i, cs] of seedCaseStudies.entries()) {
    const existing = await CaseStudyModel.findOne({ slug: cs.slug });
    if (existing && !FORCE) {
      cSkipped += 1;
      continue;
    }
    const doc = { ...cs, published: true, order: i };
    if (existing) {
      Object.assign(existing, doc);
      await existing.save();
    } else {
      await CaseStudyModel.create(doc);
    }
    cCreated += 1;
  }
  console.log(`Case studies: ${cCreated} imported, ${cSkipped} already existed (skipped)`);

  // ── General FAQs ──────────────────────────────────────────────────
  let fCreated = 0;
  let fSkipped = 0;
  for (const [i, faq] of GENERAL_FAQ_SEED.entries()) {
    const existing = await SiteFAQModel.findOne({ question: faq.question });
    if (existing && !FORCE) {
      fSkipped += 1;
      continue;
    }
    const doc = { ...faq, published: true, order: i };
    if (existing) {
      Object.assign(existing, doc);
      await existing.save();
    } else {
      await SiteFAQModel.create(doc);
    }
    fCreated += 1;
  }
  console.log(`Site FAQs:    ${fCreated} imported, ${fSkipped} already existed (skipped)`);

  // ── Editable page copy ────────────────────────────────────────────
  let kCreated = 0;
  let kSkipped = 0;
  for (const entry of SITE_CONTENT_SEED) {
    const existing = await SiteContentModel.findOne({ key: entry.key });
    if (existing && !FORCE) {
      // Keep the admin's edited value, but refresh the labelling metadata so
      // the dashboard stays accurate as the seed list grows.
      existing.group = entry.group;
      existing.label = entry.label;
      existing.hint = entry.hint;
      existing.type = entry.type;
      existing.order = entry.order;
      await existing.save();
      kSkipped += 1;
      continue;
    }
    if (existing) {
      Object.assign(existing, entry);
      await existing.save();
    } else {
      await SiteContentModel.create(entry);
    }
    kCreated += 1;
  }
  console.log(`Page copy:    ${kCreated} imported, ${kSkipped} already existed (metadata refreshed)`);

  console.log("\nSeed complete. Open /admin to edit any of this content.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

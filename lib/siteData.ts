import { connectToDatabase } from "@/lib/db/connect";
import ServiceModel from "@/models/Service";
import CaseStudyModel from "@/models/CaseStudy";
import SiteFAQModel from "@/models/SiteFAQ";
import { services as fallbackServices, type Service, type FAQ } from "@/data/services";
import { caseStudies as fallbackCaseStudies, type CaseStudy } from "@/data/caseStudies";

/**
 * All of these read from MongoDB first and fall back to the original
 * hard-coded arrays in data/*.ts if the database is empty or unreachable.
 * That means the public site keeps rendering correctly whether or not
 * `npm run seed:content` has been run yet.
 */

function stripMongoFields<T extends Record<string, unknown>>(doc: T): T {
  const { _id, __v, createdAt, updatedAt, published, order, ...rest } = doc as Record<string, unknown>;
  return rest as T;
}

export async function getServices(): Promise<Service[]> {
  try {
    await connectToDatabase();
    const docs = await ServiceModel.find({ published: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return fallbackServices;
    return docs.map((d) => stripMongoFields(d as unknown as Record<string, unknown>) as unknown as Service);
  } catch (err) {
    console.warn("[lib/siteData] Services falling back to file:", err instanceof Error ? err.message : err);
    return fallbackServices;
  }
}

export async function getServiceBySlugFromDb(slug: string): Promise<Service | null> {
  try {
    await connectToDatabase();
    // Look up the slug with no `published` filter first, so we can tell
    // "no DB document exists yet for this slug" (safe to fall back to the
    // original seed content) apart from "a DB document exists but the
    // admin unpublished it" (must NOT fall back — that would silently
    // resurrect content the admin explicitly took offline, which is both
    // a content-accuracy bug and an accidental-indexing SEO risk).
    const doc = await ServiceModel.findOne({ slug }).lean();
    if (doc) {
      return doc.published ? (stripMongoFields(doc as unknown as Record<string, unknown>) as unknown as Service) : null;
    }
    return fallbackServices.find((s) => s.slug === slug) ?? null;
  } catch (err) {
    console.warn("[lib/siteData] Service falling back to file:", err instanceof Error ? err.message : err);
    return fallbackServices.find((s) => s.slug === slug) ?? null;
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    await connectToDatabase();
    const docs = await CaseStudyModel.find({ published: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return fallbackCaseStudies;
    return docs.map((d) => stripMongoFields(d as unknown as Record<string, unknown>) as unknown as CaseStudy);
  } catch (err) {
    console.warn("[lib/siteData] Case studies falling back to file:", err instanceof Error ? err.message : err);
    return fallbackCaseStudies;
  }
}

export async function getCaseStudyBySlugFromDb(slug: string): Promise<CaseStudy | null> {
  try {
    await connectToDatabase();
    // Same reasoning as getServiceBySlugFromDb above: distinguish "not
    // created in the DB yet" from "unpublished by the admin" so an
    // unpublished case study can't be resurrected via the seed fallback.
    const doc = await CaseStudyModel.findOne({ slug }).lean();
    if (doc) {
      return doc.published ? (stripMongoFields(doc as unknown as Record<string, unknown>) as unknown as CaseStudy) : null;
    }
    return fallbackCaseStudies.find((c) => c.slug === slug) ?? null;
  } catch (err) {
    console.warn("[lib/siteData] Case study falling back to file:", err instanceof Error ? err.message : err);
    return fallbackCaseStudies.find((c) => c.slug === slug) ?? null;
  }
}

/** FAQs for the home page (only those flagged `showOnHome`). */
export async function getHomeFAQs(fallback: FAQ[]): Promise<FAQ[]> {
  try {
    await connectToDatabase();
    const docs = await SiteFAQModel.find({ published: true, showOnHome: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return fallback;
    return docs.map((d) => ({ q: d.question, a: d.answer }));
  } catch (err) {
    console.warn("[lib/siteData] Home FAQs falling back to file:", err instanceof Error ? err.message : err);
    return fallback;
  }
}

/** All published FAQs, for the dedicated /faq page. */
export async function getAllFAQs(fallback: FAQ[]): Promise<FAQ[]> {
  try {
    await connectToDatabase();
    const docs = await SiteFAQModel.find({ published: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return fallback;
    return docs.map((d) => ({ q: d.question, a: d.answer }));
  } catch (err) {
    console.warn("[lib/siteData] FAQs falling back to file:", err instanceof Error ? err.message : err);
    return fallback;
  }
}

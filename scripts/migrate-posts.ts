/**
 * One-time migration: imports the existing content/posts/*.mdx files into
 * MongoDB as published Post documents, preserving all frontmatter content
 * (title, excerpt, category, cover image, author, date, takeaways, FAQs)
 * and the full MDX body. Safe to re-run — posts are upserted by slug, so
 * running it twice won't create duplicates.
 *
 * Run with:
 *   npm run migrate:posts
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import mongoose from "mongoose";
import PostModel from "../models/Post";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

type LegacyFrontmatter = {
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: string;
  authorRole: string;
  authorPhoto?: string;
  date: string;
  takeaways?: string[];
  faqs?: { q: string; a: string }[];
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in .env.local. See .env.local.example.");
    process.exit(1);
  }

  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No content/posts directory found — nothing to migrate.");
    process.exit(0);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) {
    console.log("No .mdx files found in content/posts — nothing to migrate.");
    process.exit(0);
  }

  await mongoose.connect(uri);
  console.log(`Connected to MongoDB. Found ${files.length} MDX post(s) to migrate.`);

  let created = 0;
  let updated = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fm = data as LegacyFrontmatter;

    const doc = {
      title: fm.title,
      slug,
      excerpt: fm.excerpt,
      content: content.trim(),
      category: fm.category,
      tags: [fm.category],
      coverImage: fm.coverImage,
      author: fm.author,
      authorRole: fm.authorRole,
      authorPhoto: fm.authorPhoto,
      status: "published" as const,
      publishedAt: new Date(fm.date),
      seoTitle: fm.title,
      metaDescription: fm.excerpt,
      takeaways: fm.takeaways ?? [],
      faqs: fm.faqs ?? [],
    };

    const existing = await PostModel.findOne({ slug });
    if (existing) {
      Object.assign(existing, doc);
      await existing.save();
      updated += 1;
      console.log(`  Updated: ${slug}`);
    } else {
      await PostModel.create(doc);
      created += 1;
      console.log(`  Created: ${slug}`);
    }
  }

  console.log(`\nMigration complete. Created ${created}, updated ${updated}, total ${files.length}.`);
  console.log(
    "Your original .mdx files in content/posts/ were left untouched — you can keep them as a backup or delete them once you've verified the migrated posts in the admin dashboard."
  );

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

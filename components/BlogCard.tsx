"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PostSummary } from "@/lib/posts";
import { getCategoryStyle } from "@/lib/categoryStyle";

export default function BlogCard({ post, index = 0, priority = false }: { post: PostSummary; index?: number; priority?: boolean }) {
  const date = new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const style = getCategoryStyle(post.category);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="card-surface group block h-full overflow-hidden rounded-xl2">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface2">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 via-black/15 to-transparent" />
          <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-bold shadow-sm`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {post.category}
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-ink-heading leading-snug">{post.title}</h3>
          <p className="mt-2 text-sm text-ink-body leading-relaxed line-clamp-2">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span className="whitespace-nowrap">{post.author}</span>
            <span className="whitespace-nowrap" aria-hidden="true">•</span>
            <span className="whitespace-nowrap">{date}</span>
            <span className="whitespace-nowrap" aria-hidden="true">•</span>
            <span className="whitespace-nowrap">{post.readingTime}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

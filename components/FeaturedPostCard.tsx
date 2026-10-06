"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import QuantumWatermark from "@/components/QuantumWatermark";
import { getCategoryStyle } from "@/lib/categoryStyle";
import type { PostSummary } from "@/lib/posts";

export default function FeaturedPostCard({ post }: { post: PostSummary }) {
  const date = new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const style = getCategoryStyle(post.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] items-stretch overflow-hidden rounded-xl2 border border-border bg-white shadow-[0_2px_8px_rgba(10,15,44,0.04)] transition-shadow duration-300 ease-out-expo hover:shadow-[0_20px_40px_-15px_rgba(200,30,44,0.16)]"
      >
        <QuantumWatermark className="w-[320px] h-[160px] -bottom-12 -left-12" opacity={0.08} />
        <span className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-brand-gradient opacity-10 blur-3xl transition-opacity duration-700 ease-out-expo group-hover:opacity-20" />

        <div className="relative flex flex-col justify-center p-6 sm:p-8 order-2 lg:order-1">
          <span className={`inline-flex w-fit items-center gap-1.5 rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-bold shadow-sm`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            Latest Article
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-display font-bold text-ink-heading leading-snug transition-colors duration-300">
            {post.title}
          </h2>
          <p className="mt-2.5 text-sm text-ink-body leading-relaxed line-clamp-2">{post.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span className="whitespace-nowrap">{post.author}</span>
            <span className="whitespace-nowrap" aria-hidden="true">•</span>
            <span className="whitespace-nowrap">{date}</span>
            <span className="whitespace-nowrap" aria-hidden="true">•</span>
            <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3.5 h-3.5" /> {post.readingTime}</span>
          </div>

          <span className="btn-gradient relative mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5">
            Read Article
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
          </span>
        </div>

        <div className="relative order-1 lg:order-2 aspect-[16/9] lg:aspect-[4/3] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover transition-transform duration-[800ms] ease-out-expo group-hover:scale-110"
            priority
          />
        </div>
      </Link>
    </motion.div>
  );
}

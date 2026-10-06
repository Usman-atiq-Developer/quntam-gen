"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ArticleCoverImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="px-6 pt-12 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-4xl aspect-[16/9] sm:max-h-[440px] rounded-xl2 overflow-hidden shadow-[0_20px_50px_rgba(10,15,44,0.14)] ring-1 ring-black/5"
      >
        <div className="absolute inset-0 motion-safe:animate-kenBurns">
          <Image src={src} alt={alt} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" priority />
        </div>
      </motion.div>
    </div>
  );
}

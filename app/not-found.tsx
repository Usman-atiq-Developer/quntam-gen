"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <motion.svg
          viewBox="0 0 200 100"
          className="w-48 h-24 mx-auto mb-8"
          initial="hidden"
          animate="show"
        >
          <defs>
            <linearGradient id="notFoundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C81E2C" />
              <stop offset="100%" stopColor="#FF4B3E" />
            </linearGradient>
          </defs>
          <motion.ellipse
            cx="100"
            cy="50"
            rx="85"
            ry="28"
            transform="rotate(18 100 50)"
            stroke="url(#notFoundGradient)"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="8 10"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 30 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="100"
            cy="50"
            r="7"
            fill="url(#notFoundGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
        </motion.svg>
        <h1 className="text-h2 text-ink-heading">This page drifted off orbit</h1>
        <p className="mt-4 text-ink-body max-w-md mx-auto">
          The page you're looking for doesn't exist, or may have moved. Let's get you back on track.
        </p>
        <Link
          href="/"
          className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </section>
  );
}

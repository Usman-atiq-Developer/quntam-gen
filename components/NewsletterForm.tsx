"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Wire this up to your email provider (Resend, Mailchimp, etc.) via /app/api/newsletter
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <p className="flex items-center gap-2 text-sm text-brand-end">
        <Check className="w-4 h-4" /> You&apos;re subscribed.
      </p>
    );
  }

  const inputClasses =
    variant === "dark"
      ? "w-full rounded-full bg-surfacedark border border-borderdark px-4 py-2.5 text-sm text-white placeholder:text-ink-onDarkMuted outline-none focus-visible:border-brand-end"
      : "w-full rounded-full bg-surface2 border border-border px-4 py-2.5 text-sm text-ink-heading placeholder:text-ink-muted outline-none focus-visible:border-brand-end";

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClasses}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="shrink-0 rounded-full bg-brand-gradient p-2.5 text-white transition-transform duration-micro ease-out-expo hover:scale-105"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

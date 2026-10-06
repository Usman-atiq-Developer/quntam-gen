"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { QuantumOrbit } from "@/components/QuantumOrbit";

const schema = z.object({
  clientName: z.string().min(2, "Enter your full name"),
  clientEmail: z.string().email("Enter a valid email address"),
  clientCompany: z.string().optional(),
  targetUrl: z
    .string()
    .min(1, "Enter the URL you'd like linked")
    .url("Enter a full URL, e.g. https://example.com"),
  anchorText: z.string().min(1, "Enter the anchor text you'd like used"),
  relatedArticle: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LinkInsertionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setStatus("loading");
    try {
      const res = await fetch("/api/link-insertion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(json?.error || "Request failed");
        throw new Error("Request failed");
      }
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card-surface rounded-xl2 p-10 text-center"
      >
        <CheckCircle2 className="w-12 h-12 text-brand-end mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-ink-heading mb-2">Request submitted</h3>
        <p className="text-sm text-ink-body">
          Thanks — we&apos;ll review your link insertion request and get back to you by email.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-brand-end hover:text-ink-heading transition-colors"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-surface rounded-xl2 p-8 space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" error={errors.clientName?.message}>
          <input {...register("clientName")} className="input-field" placeholder="Jane Doe" />
        </Field>
        <Field label="Email" error={errors.clientEmail?.message}>
          <input {...register("clientEmail")} type="email" className="input-field" placeholder="jane@company.com" />
        </Field>
      </div>

      <Field label="Company (optional)">
        <input {...register("clientCompany")} className="input-field" placeholder="Acme Inc." />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="URL you'd like linked" error={errors.targetUrl?.message}>
          <input {...register("targetUrl")} type="url" className="input-field" placeholder="https://yoursite.com/page" />
        </Field>
        <Field label="Preferred anchor text" error={errors.anchorText?.message}>
          <input {...register("anchorText")} className="input-field" placeholder="e.g. best project management tools" />
        </Field>
      </div>

      <Field label="Article/page you'd like it placed in (optional)">
        <input
          {...register("relatedArticle")}
          className="input-field"
          placeholder="e.g. quntamgen.com/blog/how-seo-actually-works-in-2026"
        />
      </Field>

      <Field label="Anything else we should know? (optional)">
        <textarea
          {...register("message")}
          rows={4}
          className="input-field resize-none"
          placeholder="Context on your site, relevance, timeline, etc."
        />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gradient w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <QuantumOrbit className="w-5 h-3" /> Submit Request
          </>
        )}
      </button>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-center text-red-400"
          >
            {errorMessage || "Something went wrong — please try again or email us directly."}
          </motion.p>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .input-field {
          width: 100%;
          background: #141b3d;
          border: 1px solid #232b54;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 250ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .input-field:focus {
          border-color: #ff4b3e;
        }
        .input-field::placeholder {
          color: #7c87ad;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-heading mb-2">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-400 mt-1.5">{error}</span>}
    </label>
  );
}

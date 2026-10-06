"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Service } from "@/data/services";
import { services as fallbackServices } from "@/data/services";
import { QuantumOrbit } from "@/components/QuantumOrbit";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Select a service"),
  budget: z.string().min(1, "Select a budget range"),
  message: z.string().min(10, "Tell us a little more about your project"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm({ services: dbServices }: { services?: Service[] }) {
  // Falls back to the original hard-coded list only if the caller didn't
  // pass the live DB-backed list — keeps this dropdown's options in sync
  // with whatever services are actually published right now.
  const services = dbServices ?? fallbackServices;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
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
        <h3 className="text-xl font-semibold text-ink-heading mb-2">Message sent</h3>
        <p className="text-sm text-ink-body">
          Thanks for reaching out — we&apos;ll get back to you within one business day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-brand-end hover:text-ink-heading transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-surface rounded-xl2 p-8 space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" error={errors.name?.message}>
          <input {...register("name")} className="input-field" placeholder="Jane Doe" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input-field" placeholder="jane@company.com" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Phone (optional)">
          <input {...register("phone")} type="tel" className="input-field" placeholder="+1 (000) 000-0000" />
        </Field>
        <Field label="Service you're interested in" error={errors.service?.message}>
          <select {...register("service")} className="input-field" defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </Field>
      </div>

      <Field label="Budget range" error={errors.budget?.message}>
        <select {...register("budget")} className="input-field" defaultValue="">
          <option value="" disabled>
            Select a budget range
          </option>
          <option value="Under $1,000">Under $1,000</option>
          <option value="$1,000 – $5,000">$1,000 – $5,000</option>
          <option value="$5,000 – $15,000">$5,000 – $15,000</option>
          <option value="$15,000+">$15,000+</option>
        </select>
      </Field>

      <Field label="Tell us about your project" error={errors.message?.message}>
        <textarea {...register("message")} rows={5} className="input-field resize-none" placeholder="What are you looking to achieve?" />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gradient w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <QuantumOrbit className="w-5 h-3" /> Send Message
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
            Something went wrong — please try again or email us directly.
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

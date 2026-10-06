import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className,
  icon = true,
  inverted = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  icon?: boolean;
  inverted?: boolean;
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={clsx(
          "group btn-gradient relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white",
          className
        )}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 skew-x-12 transition-transform duration-500 ease-out-expo group-hover:translate-x-full" />
        <span className="relative">{children}</span>
        {icon && <ArrowRight className="relative w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out-expo",
        inverted
          ? "border-white/25 text-white hover:bg-white hover:text-basedark hover:border-transparent hover:shadow-glow"
          : "border-border text-ink-heading hover:bg-basedark hover:text-white hover:border-transparent hover:shadow-glow hover:-translate-y-0.5",
        className
      )}
    >
      {children}
      {icon && <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />}
    </Link>
  );
}

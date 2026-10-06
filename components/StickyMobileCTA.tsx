import Link from "next/link";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-border bg-base/95 backdrop-blur-md px-4 py-3">
      <Link
        href="/contact"
        className="btn-gradient flex items-center justify-center rounded-full py-3 text-sm font-semibold text-white"
      >
        Get a Free Quote
      </Link>
    </div>
  );
}

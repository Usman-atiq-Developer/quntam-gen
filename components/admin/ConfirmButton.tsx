"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";

/**
 * A delete button that requires two clicks: the first turns it into a
 * "Confirm?" state for 3 seconds, the second actually fires onConfirm.
 * Avoids the need for a separate modal for simple destructive actions.
 */
export default function ConfirmButton({
  onConfirm,
  label = "Delete",
  className = "",
}: {
  onConfirm: () => void | Promise<void>;
  label?: string;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  async function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
        confirming
          ? "bg-red-500 text-white"
          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
      } ${className}`}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      {confirming ? "Confirm?" : label}
    </button>
  );
}

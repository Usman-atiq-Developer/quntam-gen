"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem("qg-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function respond(value: "accepted" | "declined") {
    window.localStorage.setItem("qg-cookie-consent", value);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <p className="text-sm text-ink-body">
              We use cookies to improve your experience and measure the performance of our marketing,
              including Meta Ads. See our{" "}
              <a href="/privacy-policy" className="text-brand-end underline">
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => respond("declined")}
                className="rounded-full border border-border px-4 py-2 text-sm text-ink-body hover:text-ink-heading transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => respond("accepted")}
                className="btn-gradient rounded-full px-4 py-2 text-sm font-semibold text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

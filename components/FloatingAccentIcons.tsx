"use client";

import { motion } from "framer-motion";
import { ServiceIcon } from "@/components/IconMap";
import type { Theme } from "@/data/services";

const positions = [
  { top: "12%", left: "8%", size: "w-12 h-12", delay: 0, duration: 6 },
  { top: "62%", left: "4%", size: "w-9 h-9", delay: 0.6, duration: 7 },
  { top: "20%", left: "92%", size: "w-10 h-10", delay: 0.3, duration: 6.5 },
];

export default function FloatingAccentIcons({ icons, theme }: { icons: [string, string, string]; theme: Theme }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      {icons.map((icon, i) => {
        const pos = positions[i];
        return (
          <motion.div
            key={icon + i}
            className={`absolute ${pos.size} rounded-2xl flex items-center justify-center backdrop-blur-sm`}
            style={{
              top: pos.top,
              left: pos.left,
              backgroundColor: `rgba(${theme.glow}, 0.10)`,
              border: `1px solid rgba(${theme.glow}, 0.18)`,
              color: theme.from,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: pos.delay },
              y: { duration: pos.duration, repeat: Infinity, ease: "easeInOut", delay: pos.delay },
            }}
          >
            <ServiceIcon name={icon} className="w-1/2 h-1/2" />
          </motion.div>
        );
      })}
    </div>
  );
}

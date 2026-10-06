import type { Theme } from "@/data/services";
import type { CSSProperties } from "react";

export function themeGradient(theme: Theme, angle = 90): CSSProperties {
  return { backgroundImage: `linear-gradient(${angle}deg, ${theme.from} 0%, ${theme.to} 100%)` };
}

export function themeGradientText(theme: Theme): CSSProperties {
  return {
    backgroundImage: `linear-gradient(90deg, ${theme.from} 0%, ${theme.to} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
}

export function themeGlow(theme: Theme, opacity = 0.35): CSSProperties {
  return { boxShadow: `0 20px 45px rgba(${theme.glow}, ${opacity})` };
}

export function themeTintBg(theme: Theme): CSSProperties {
  return { backgroundColor: theme.tint };
}

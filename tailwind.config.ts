import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#F7F7F8",
        basedark: "#0A0A0C",
        surface: "#FFFFFF",
        surface2: "#F1F1F3",
        surfacedark: "#19191C",
        border: "#E3E3E7",
        borderdark: "#2C2C31",
        brand: {
          start: "#C81E2C",
          end: "#FF4B3E",
        },
        accent: {
          violet: "#6D28D9",
          teal: "#0F766E",
          gold: "#B45309",
        },
        ink: {
          heading: "#0A0A0C",
          body: "#4B4B52",
          muted: "#8A8A92",
          onDark: "#FFFFFF",
          onDarkMuted: "#B8B8C0",
          onLight: "#0A0A0C",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #C81E2C 0%, #FF4B3E 100%)",
        "brand-gradient-diag": "linear-gradient(135deg, #C81E2C 0%, #FF4B3E 60%, #7C5CFC 120%)",
        "brand-gradient-soft": "linear-gradient(90deg, rgba(200,30,44,0.10) 0%, rgba(255,75,62,0.10) 100%)",
        "mesh-glow":
          "radial-gradient(60% 60% at 20% 20%, rgba(200,30,44,0.35) 0%, rgba(200,30,44,0) 60%), radial-gradient(50% 50% at 85% 15%, rgba(255,75,62,0.28) 0%, rgba(255,75,62,0) 60%), radial-gradient(70% 70% at 50% 100%, rgba(124,92,252,0.22) 0%, rgba(124,92,252,0) 60%)",
        "mesh-glow-light":
          "radial-gradient(50% 50% at 15% 10%, rgba(200,30,44,0.07) 0%, rgba(200,30,44,0) 60%), radial-gradient(45% 45% at 90% 20%, rgba(124,92,252,0.07) 0%, rgba(124,92,252,0) 60%)",
        "hero-light":
          "radial-gradient(120% 90% at 12% -10%, #FCE2E2 0%, rgba(252,226,226,0) 55%), radial-gradient(100% 90% at 92% 0%, #EEE6FF 0%, rgba(238,230,255,0) 50%), radial-gradient(80% 80% at 50% 100%, #FFF2D6 0%, rgba(255,242,214,0) 55%), linear-gradient(180deg, #F7F7F8 0%, #FFFFFF 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        h1: ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["clamp(2rem, 3.4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h3: ["clamp(1.5rem, 2.4vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        h4: ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        h5: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        h6: ["0.9375rem", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.02em" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
        small: ["0.9375rem", { lineHeight: "1.6" }],
        caption: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        micro: "250ms",
        section: "700ms",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        glow: "0 0 40px rgba(200, 30, 44, 0.25)",
        card: "0 8px 30px rgba(4, 4, 6, 0.45)",
      },
      screens: {
        xs: "375px",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.06)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        waveFlow: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        orbitSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 7s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
        kenBurns: "kenBurns 12s ease-in-out infinite alternate",
        waveFlow: "waveFlow 5s linear infinite",
        orbitSpin: "orbitSpin 14s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

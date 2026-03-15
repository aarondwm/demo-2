import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    // Kill ALL rounding by default — sharp corners everywhere
    borderRadius: {
      none: "0px",
      DEFAULT: "0px",
      sm: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "9999px", // kept only for circular avatars
    },
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Core palette
        "ink":     "#04060c",
        "ink-1":   "#070910",
        "ink-2":   "#0a0c16",
        "ink-3":   "#0d1020",
        // Borders
        "wire-0":  "#141726",
        "wire-1":  "#1c1f30",
        "wire-2":  "#272b3e",
        // Text
        "ash-0":   "#e8eaf2",  // primary
        "ash-1":   "#636b84",  // secondary
        "ash-2":   "#363c52",  // tertiary
        // Accent — amber gold, used sparingly
        "gold":    "#4a6cf7",
        "gold-dim":"rgba(196,162,74,0.10)",
        // Tailwind/shadcn tokens
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        // Normalized type scale
        "label":  ["10px",  { lineHeight: "1",    letterSpacing: "0.25em" }],
        "data":   ["11px",  { lineHeight: "1.4",  letterSpacing: "0.12em" }],
        "body-sm":["13px",  { lineHeight: "1.8",  letterSpacing: "0.01em" }],
        "body":   ["14px",  { lineHeight: "1.8",  letterSpacing: "0.01em" }],
        "body-lg":["16px",  { lineHeight: "1.7",  letterSpacing: "0.01em" }],
        "title-sm":["32px", { lineHeight: "1",    letterSpacing: "0.05em" }],
        "title":   ["48px", { lineHeight: "0.95", letterSpacing: "0.05em" }],
        "title-lg":["64px", { lineHeight: "0.93", letterSpacing: "0.04em" }],
        "title-xl":["80px", { lineHeight: "0.92", letterSpacing: "0.03em" }],
        "hero":    ["clamp(72px,10vw,120px)", { lineHeight: "0.90", letterSpacing: "0.02em" }],
      },
      letterSpacing: {
        "widest-2": "0.25em",
        "widest-3": "0.35em",
      },
      keyframes: {
        "reveal-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "line-grow": {
          "0%":   { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "spotlight": {
          "0%":   { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
      },
      animation: {
        "reveal-up":   "reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "reveal-in":   "reveal-in 0.9s ease forwards",
        "line-grow":   "line-grow 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "spotlight":   "spotlight 2s ease .75s 1 forwards",
      },
    },
  },
  plugins: [],
};

export default config;

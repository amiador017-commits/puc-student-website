import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        space: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
          600: "#52525b",
        },
        neon: {
          DEFAULT: "#a3e635",
          glow: "#d9f99d",
          dark: "#65a30d",
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        "space-mono": ["var(--font-space-mono)", "monospace"],
      },
      borderRadius: {
        "clay-sm": "8px",
        "clay": "12px",
        "clay-lg": "16px",
        "clay-xl": "20px",
      },
      boxShadow: {
        "clay-flat": "4px 4px 12px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.05)",
        "clay-raised": "6px 6px 18px rgba(0,0,0,0.5), inset -4px -4px 10px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.06)",
        "clay-floating": "0 12px 40px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.05)",
        "clay-inset": "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
        "clay-inset-deep": "inset 4px 4px 8px rgba(0,0,0,0.65), inset -2px -2px 4px rgba(255,255,255,0.03)",
        "clay-neon": "4px 4px 12px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
        "clay-neon-lg": "6px 6px 18px rgba(163,230,53,0.25), inset -3px -3px 6px rgba(0,0,0,0.35), inset 2px 2px 4px rgba(255,255,255,0.5)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".clay-card": {
          "background-color": "#1c1c22",
          "border-radius": "16px",
          "box-shadow": "6px 6px 18px rgba(0,0,0,0.5), inset -4px -4px 10px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.06)",
          "transition": "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        },
        ".clay-card:hover": {
          "transform": "translateY(-3px)",
          "box-shadow": "8px 8px 22px rgba(0,0,0,0.6), inset -4px -4px 10px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.06)",
        },
        ".clay-card:active": {
          "transform": "translateY(1px) scale(0.99)",
          "box-shadow": "3px 3px 10px rgba(0,0,0,0.5), inset -4px -4px 10px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.06)",
        },
        ".clay-btn": {
          "border-radius": "12px",
          "box-shadow": "3px 3px 8px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
          "transition": "all 0.2s ease",
        },
        ".clay-btn:hover": {
          "filter": "brightness(1.1)",
        },
        ".clay-btn:active": {
          "transform": "translateY(1px)",
        },
        ".clay-input": {
          "background-color": "#0b0b0e",
          "border-radius": "12px",
          "box-shadow": "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
          "border": "1px solid rgba(255,255,255,0.03)",
          "transition": "all 0.2s ease",
        },
        ".clay-input:focus": {
          "box-shadow": "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03), 0 0 0 2px rgba(163,230,53,0.2)",
          "border-color": "rgba(163,230,53,0.3)",
        },
      });
    }),
  ],
};

export default config;

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
          950: "#09090b", // zinc-950
          900: "#18181b", // zinc-900
          800: "#27272a", // zinc-800
        },
        neon: {
          DEFAULT: "#a3e635", // lime-400
          glow: "#d9f99d",    // lime-200
          dark: "#65a30d",    // lime-600
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        "space-mono": ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".flat-card": {
          "background-color": "#1c1c22",
          "border-radius": "32px",
          "box-shadow": "8px 8px 24px rgba(0, 0, 0, 0.55), inset -6px -6px 12px rgba(0, 0, 0, 0.65), inset 3px 3px 6px rgba(255, 255, 255, 0.06)",
          "transition": "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        },
        ".flat-card:hover": {
          "transform": "translateY(-4px)",
          "box-shadow": "12px 12px 28px rgba(0, 0, 0, 0.65), inset -6px -6px 12px rgba(0, 0, 0, 0.65), inset 3px 3px 6px rgba(255, 255, 255, 0.06)",
        },
        ".flat-card:active": {
          "transform": "translateY(2px) scale(0.99)",
          "box-shadow": "4px 4px 12px rgba(0, 0, 0, 0.65), inset -6px -6px 12px rgba(0, 0, 0, 0.65), inset 3px 3px 6px rgba(255, 255, 255, 0.06)",
        },
        ".flat-card-accent": {
          "background-color": "#a3e635",
          "border-radius": "32px",
          "box-shadow": "8px 8px 24px rgba(163, 230, 53, 0.1), inset -6px -6px 12px rgba(0, 0, 0, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.5)",
          "transition": "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        },
        ".flat-card-accent:hover": {
          "transform": "translateY(-4px)",
          "box-shadow": "12px 12px 28px rgba(163, 230, 53, 0.18), inset -6px -6px 12px rgba(0, 0, 0, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.5)",
        },
        ".flat-card-accent:active": {
          "transform": "translateY(2px) scale(0.99)",
          "box-shadow": "4px 4px 12px rgba(163, 230, 53, 0.08), inset -6px -6px 12px rgba(0, 0, 0, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.5)",
        },
      });
    }),
  ],
};

export default config;

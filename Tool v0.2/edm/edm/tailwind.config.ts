import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ---- Colores del juego (design tokens) ----
      colors: {
        // Sistema base
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Primario / acento
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // ---- Tokens del juego ----
        gold: "#D4AF37",
        "gold-dark": "#a07d1a",

        // Facciones
        tain: "#4CAF7D",
        dein: "#E05252",
        bisk: "#A87FD6",
        evol: "#E8C84A",

        // Estados
        "pv-active": "#22c55e",
        "pv-active-light": "#4ade80",
        "pv-empty": "#2d2d2d",

        // Niveles de presupuesto
        budget: {
          ok: "#4ade80",
          warn: "#D4AF37",
          over: "#ef4444",
        },
      },

      // ---- Backgrounds de facciones ----
      backgroundColor: {
        "tain-dark": "#0b1f14",
        "dein-dark": "#1f0b0b",
        "bisk-dark": "#130b1f",
        "evol-dark": "#1a1800",
      },

      // ---- Fuentes ----
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "serif"],
      },

      // ---- Border radius ----
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ---- Animaciones ----
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "cost-flash": {
          "0%": { backgroundColor: "rgba(212, 175, 55, 0.3)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "cost-flash": "cost-flash 0.5s ease-out",
      },

      // ---- Print utilities ----
      screens: {
        print: { raw: "print" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

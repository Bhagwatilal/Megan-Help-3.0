import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        mentii: {
          50: "#f0f7ff",
          100: "#e0eefe",
          200: "#b9ddfc",
          300: "#7cc3f9",
          400: "#36a4f4",
          500: "#0d87de",
          600: "#026bbd",
          700: "#065698",
          800: "#0b487e",
          900: "#0f3e69",
          950: "#0a2744",
        },
        lavender: {
          50: "#f6f4ff",
          100: "#edebfe",
          200: "#dcd7fd",
          300: "#c2b5fb",
          400: "#a48bf7",
          500: "#8662f0",
          600: "#7443e3",
          700: "#632bc7",
          800: "#5226a3",
          900: "#452285",
          950: "#290f59",
        },
        sunset: {
          50: "#fff7ed",
          100: "#ffeed5",
          200: "#fdd8ab",
          300: "#fbb976",
          400: "#f99240",
          500: "#f57219",
          600: "#e1530f",
          700: "#bc3b10",
          800: "#963115",
          900: "#7a2c15",
          950: "#431208",
        },
        mint: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#bbf7d6",
          300: "#86ebb3",
          400: "#4ad687",
          500: "#22b864",
          600: "#15954d",
          700: "#157941",
          800: "#166039",
          900: "#134f32",
          950: "#042f1c",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "wave": {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-10px)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-down": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 12s linear infinite",
        "wave": "wave 2s ease-in-out infinite",
        "scale-up": "scale-up 0.3s ease-out",
        "scale-down": "scale-down 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-out",
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(185, 221, 252, 0.3)',
        'glow-md': '0 0 20px rgba(185, 221, 252, 0.4)',
        'glow-lg': '0 0 30px rgba(185, 221, 252, 0.5)',
        'glow-xl': '0 0 40px rgba(185, 221, 252, 0.6)',
        'neomorphic': '10px 10px 20px rgba(0, 0, 0, 0.05), -10px -10px 20px rgba(255, 255, 255, 0.5)',
        'neomorphic-dark': '10px 10px 20px rgba(0, 0, 0, 0.2), -10px -10px 20px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

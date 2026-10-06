import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Lexend", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50:  "#eff8ff",
          100: "#dbeeff",
          200: "#bfe3ff",
          300: "#91d1ff",
          400: "#5db6fd",
          500: "#3796f9",
          600: "#1a75ee",
          700: "#0a6ebd",
          800: "#1057a0",
          900: "#134882",
          950: "#0e2f57",
        },
        teal: {
          50:  "#edfafa",
          100: "#d5f5f6",
          200: "#afecee",
          300: "#76e0e3",
          400: "#3bcdd1",
          500: "#00b4a0",
          600: "#009688",
          700: "#027a6f",
          800: "#076159",
          900: "#0a4f49",
        },
        navy: {
          700: "#1a2a4a",
          800: "#111d38",
          900: "#0d1525",
          950: "#0a0f1e",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

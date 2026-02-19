import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#135bec",
        "bg-light": "#f6f6f8",
        "bg-dark": "#101622",
        surface: "#f5f5f7",
        border: "#f0f2f4",
        "text-primary": "#111318",
        "text-secondary": "#6e6e73",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;

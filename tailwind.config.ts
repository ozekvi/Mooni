import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f0ff",
          100: "#ede0ff",
          200: "#dcc5ff",
          300: "#c49aff",
          400: "#a855f7",
          500: "#9333ea",
          600: "#7c22d4",
          700: "#6b21a8",
          800: "#581c87",
          900: "#3b0764",
          950: "#1e003d",
        },
        dark: {
          50: "#1a0a2e",
          100: "#150825",
          200: "#0f051a",
          300: "#09030f",
          400: "#060208",
        },
        accent: {
          gold: "#d4af37",
          violet: "#8b5cf6",
          glow: "#c084fc",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-raleway)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      animation: {
        "moon-float": "moonFloat 6s ease-in-out infinite",
        "moon-glow": "moonGlow 3s ease-in-out infinite alternate",
        "star-twinkle": "starTwinkle 2s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
      },
      keyframes: {
        moonFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(-5deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        moonGlow: {
          "0%": { filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))" },
          "100%": { filter: "drop-shadow(0 0 40px rgba(192, 132, 252, 0.9)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.6))" },
        },
        starTwinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.8)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "purple-mesh": "radial-gradient(at 40% 20%, hsla(280,100%,20%,0.8) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(260,100%,15%,0.6) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(290,100%,10%,0.8) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // New dichromatic color scheme
        theme: {
          navy: "#233D4D",
          orange: "#FE7F2D",
          // Navy shades with opacity
          navy50: "rgba(35, 61, 77, 0.05)",
          navy100: "rgba(35, 61, 77, 0.1)",
          navy200: "rgba(35, 61, 77, 0.2)",
          navy300: "rgba(35, 61, 77, 0.3)",
          navy400: "rgba(35, 61, 77, 0.4)",
          navy500: "rgba(35, 61, 77, 0.5)",
          navy600: "rgba(35, 61, 77, 0.6)",
          navy700: "rgba(35, 61, 77, 0.7)",
          navy800: "rgba(35, 61, 77, 0.8)",
          navy900: "rgba(35, 61, 77, 0.9)",
          // Orange shades with opacity
          orange50: "rgba(254, 127, 45, 0.05)",
          orange100: "rgba(254, 127, 45, 0.1)",
          orange200: "rgba(254, 127, 45, 0.2)",
          orange300: "rgba(254, 127, 45, 0.3)",
          orange400: "rgba(254, 127, 45, 0.4)",
          orange500: "rgba(254, 127, 45, 0.5)",
          orange600: "rgba(254, 127, 45, 0.6)",
          orange700: "rgba(254, 127, 45, 0.7)",
          orange800: "rgba(254, 127, 45, 0.8)",
          orange900: "rgba(254, 127, 45, 0.9)",
          // Lighter and darker variations
          navyLight: "#2d4d61",
          navyDark: "#1a2d39",
          orangeLight: "#ff9447",
          orangeDark: "#e56a1a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "serif"],
        mono: ["Fira Code", "monospace"],
        heading: ["Oswald", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

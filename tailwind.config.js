/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // CSS変数を使用したTailwindクラス
    "w-[var(--base)]",
    "w-[var(--sectionMW)]",
    "w-[var(--sectionMax)]",
    "max-w-[var(--sectionMax)]",
    "min-w-[var(--sectionMax)]",
    "h-[var(--head)]",
    "px-[var(--mainBezel)]",
    "py-[var(--sectionPY)]",
    "mt-[var(--sectionMT)]",
    "mb-[var(--titleAfter)]",
    "gap-[var(--gap)]",
    // 動的に生成される可能性のあるクラス
    {
      pattern: /w-\[var\(--.*\)\]/,
    },
    {
      pattern: /min-w-\[var\(--.*\)\]/,
    },
    {
      pattern: /max-w-\[var\(--.*\)\]/,
    },
    {
      pattern: /h-\[var\(--.*\)\]/,
    },
    {
      pattern: /min-h-\[var\(--.*\)\]/,
    },
    {
      pattern: /max-h-\[var\(--.*\)\]/,
    },
    {
      pattern: /p[xytblr]?-\[var\(--.*\)\]/,
    },
    {
      pattern: /m[xytblr]?-\[var\(--.*\)\]/,
    },
    {
      pattern: /gap-\[var\(--.*\)\]/,
    },
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
      fontFamily: {
        sans: ["var(--font-family-base)"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
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
    },
  },
  plugins: [],
};

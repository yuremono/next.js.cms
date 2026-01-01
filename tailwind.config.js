/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // CSS変数を使用したTailwindクラス（実際に使用されているもののみ）
    "w-[var(--base)]",
    "w-[var(--sectionMW)]",
    "w-[var(--sectionMax)]",
    "max-w-[var(--sectionMax)]",
    "min-w-[var(--sectionMax)]",
    "h-[var(--head)]",
    "px-[var(--spaceX)]",
    "py-[var(--sectionPY)]",
    "mt-[var(--sectionMT)]",
    "mb-[var(--titleAfter)]",
    "gap-[var(--gap)]",
    // RTL（Right-to-Left）関連のクラス
    "direction-rtl",
    "dir-rtl",
    "rtl",
    // よく使うカスタム値を事前に生成
    "text-[20vmin]",
    "text-[16vmin]",
    "text-[12vmin]",
    "opacity-[.67]",
    "opacity-[0.5]",
    "opacity-[0.25]",
    "w-[200px]",
    "w-[300px]",
    "bg-[#ff0000]",
    "bg-[#00ff00]",
    "bg-[#0000ff]",
    "h-[calc(100vh-2rem)]",
    "text-[12px]",
    "text-[16px]",
    "text-[24px]",
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
      // RTL関連のユーティリティを追加
      direction: {
        rtl: "rtl",
        ltr: "ltr",
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
  // カスタム値の使用を有効化
  experimental: {
    arbitraryValues: true,
  },
  // 開発時のパフォーマンス向上
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

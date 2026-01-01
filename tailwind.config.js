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

    // 任意単位のテキストサイズを常に有効化 (em, px, rem, vmin, vmax, %)
    {
      pattern: /^text-\[[0-9.]+(em|px|rem|vmin|vmax|%)\]/,
    },

    // 1. レイアウト & フレックス (レスポンシブ sm, md, lg 対応)
    {
      pattern:
        /^(flex|grid|block|inline|hidden|table|items|justify|content|self|flex-row|flex-col|flex-wrap|grid-cols)/,
      variants: ["sm", "md", "lg"],
    },

    // 2. 余白 & サイズ (0〜96までの数値を網羅し、auto, full, px等も追加)
    {
      pattern:
        /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|w|h|min-w|min-h|max-w|max-h)-(auto|full|screen|px|[0-9.]+|[1-9]0|1\/2|1\/3|2\/3|1\/4|2\/4|3\/4)/,
      variants: ["sm", "md", "lg"],
    },

    // 3. テキスト (サイズ 2xl までに制限)
    {
      pattern:
        /^(text|font)-(xs|sm|base|lg|xl|2xl|thin|light|normal|medium|semibold|bold|extrabold|left|center|right|justify)/,
      variants: ["sm", "md", "lg", "hover"],
    },

    // 4. カラー (主要色 + 指定いただいた色、foreground 等の接尾辞対応)
    {
      pattern:
        /^(text|bg|border)-(white|black|transparent|primary|secondary|accent|muted|card|border|input|ring|destructive)(|-foreground)/,
      variants: ["hover"],
    },
    {
      pattern:
        /^(text|bg|border)-(slate|gray|zinc|red|blue|green|yellow|orange|lime|teal|cyan|sky|violet|purple|pink)-(50|[1-9]00)/,
      variants: ["hover"],
    },

    // 5. 装飾 (角丸、ボーダー、透明度、z-index)
    {
      pattern:
        /^(rounded|border|opacity|z)-(none|sm|md|lg|xl|2xl|3xl|full|[0-9]+)/,
      variants: ["hover"],
    },

    // 6. 配置 (top, right, bottom, left, inset)
    {
      pattern:
        /^(top|right|bottom|left|inset)-(-?0|auto|full|1\/2|1\/3|2\/3|1\/4|2\/4|3\/4|[0-9.]+)/,
      variants: ["sm", "md", "lg"],
    },

    // 7. 特殊 (アスペクト比、オブジェクトフィット、背景位置)
    { pattern: /^(aspect|object)-(square|video|auto|contain|cover|fill)/ },
    {
      pattern:
        /^(bg)-(cover|contain|center|top|bottom|left|right|no-repeat|repeat|left-top|left-bottom|right-top|right-bottom)/,
      variants: ["sm", "md", "lg"],
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
      fontSize: {
        "1.25em": "1.25em",
        "1.5em": "1.5em",
        "2em": "2em",
        "2.5em": "2.5em",
        "3em": "3em",
      },
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

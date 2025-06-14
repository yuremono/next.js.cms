import { Metadata } from "next";
import { Page, Section } from "@/types";

interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

// デフォルトSEO設定
const defaultSEO = {
  title: "CMS - 高機能コンテンツ管理システム",
  description:
    "Next.js + TypeScript + Tailwind CSSで構築された高機能CMSシステム。直感的な編集機能と美しいデザインを提供します。",
  image: "/og-image.png",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  type: "website" as const,
};

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const seo = { ...defaultSEO, ...config };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.tags?.join(", "),
    authors: seo.authors?.map((name) => ({ name })),
    creator: "CMS System",
    publisher: "CMS System",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(seo.url),
    alternates: {
      canonical: seo.url,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: "CMS System",
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: "ja_JP",
      type: seo.type,
      ...(seo.type === "article" && {
        publishedTime: seo.publishedTime,
        modifiedTime: seo.modifiedTime,
        authors: seo.authors,
        tags: seo.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image],
      creator: "@cms_system",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ページデータからSEO情報を抽出
export function extractSEOFromPage(page: Page): SEOConfig {
  const title = extractTitleFromSections(page.sections);
  const description = extractDescriptionFromSections(page.sections);
  const image = extractImageFromSections(page.sections);

  return {
    title: title ? `${title} | CMS` : undefined,
    description,
    image,
  };
}

function extractTitleFromSections(sections: Section[]): string | undefined {
  // MainVisualセクションからタイトルを抽出
  const mainVisual = sections.find((s) => s.layout === "mainVisual");
  if (mainVisual && "html" in mainVisual) {
    const htmlContent = mainVisual.html;
    const titleMatch = htmlContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/<[^>]*>/g, "").trim();
    }
  }
  return undefined;
}

function extractDescriptionFromSections(
  sections: Section[]
): string | undefined {
  // 最初のテキストコンテンツから説明文を抽出
  for (const section of sections) {
    if ("html" in section) {
      const htmlContent = section.html;
      const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
      if (textContent && textContent.length > 50) {
        return (
          textContent.substring(0, 160) +
          (textContent.length > 160 ? "..." : "")
        );
      }
    }
  }
  return undefined;
}

function extractImageFromSections(sections: Section[]): string | undefined {
  // 最初の画像を抽出
  for (const section of sections) {
    if ("image" in section && section.image) {
      return section.image;
    }
    if (section.layout === "cards" && section.cards[0]?.image) {
      return section.cards[0].image;
    }
  }
  return undefined;
}

// 構造化データ (JSON-LD) 生成
export function generateStructuredData(page: Page, url: string) {
  const seo = extractSEOFromPage(page);

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CMS System",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    description: defaultSEO.description,
    inLanguage: "ja-JP",
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name: seo.title || defaultSEO.title,
    description: seo.description || defaultSEO.description,
    isPartOf: {
      "@type": "WebSite",
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
    inLanguage: "ja-JP",
    ...(seo.image && {
      image: {
        "@type": "ImageObject",
        url: seo.image,
      },
    }),
  };

  // 組織情報
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CMS System",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    description:
      "Next.js + TypeScript + Tailwind CSSで構築された高機能CMSシステム",
    ...(seo.image && {
      logo: {
        "@type": "ImageObject",
        url: seo.image,
      },
    }),
  };

  return [website, webpage, organization];
}

// JSON-LD script tagを生成
export function generateJsonLdScript(data: any[]) {
  return data
    .map(
      (item, index) =>
        `<script key="jsonld-${index}" type="application/ld+json">
      ${JSON.stringify(item)}
    </script>`
    )
    .join("\n");
}

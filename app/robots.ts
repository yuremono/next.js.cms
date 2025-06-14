import { MetadataRoute } from "next";


export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const isProduction = process.env.NODE_ENV === "production";

  return {
    rules: {
      userAgent: "*",
      allow: isProduction ? ["/"] : [],
      disallow: isProduction
        ? ["/editor", "/api/", "/login", "/admin", "/_next/", "/favicon.ico"]
        : ["/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

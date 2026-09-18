import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The CMS console is private. /launch stays crawlable so bots can read its noindex tag.
        disallow: ["/admin"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

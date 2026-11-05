import type { NextConfig } from "next";

// Posts moved to short camelCase slugs in Nov 2026; old links keep working.
// Case-only differences (e.g. /blog/synergylearn) are handled by the post page, not here:
// redirect sources match case-insensitively, so they would loop.
const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "genai-basics-for-working-developers": "genAiBasics",
  "genai-writes-fluently-thats-the-problem": "genAiFluency",
  "email-digital-twin-my-sent-folder": "emailTwin",
  "dsa-karle-watch-algorithms-think": "dsaKarle",
  "synergylearn-and-the-readme-that-lied": "synergyLearn",
  "running-ai-locally-when-ram-became-luxury": "localAi",
  "an-agent-is-a-loop-with-a-budget": "agents",
  "killit-safe-port-killer": "killit",
  "ayush-framework-architect-your-ux-system-handoff": "ayushFramework",
  "rag-is-dead-long-live-rag": "rag",
  "building-a-credible-ai-portfolio": "aiPortfolio",
  // Retired posts and their replacements.
  "i-put-a-style-linter-on-my-own-blog": "semanticSearch",
  deepInfra: "deepInfer",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(BLOG_SLUG_REDIRECTS).map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },
  images: {
    // CMS uploads (profile photo, project images) are served from Firebase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;

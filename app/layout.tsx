import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./tokens.css";
import "./portfolio.css";
import "./primitives.css";
import Navbar from "@/components/Navbar";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, absoluteUrl } from "@/lib/seo";
import { profile } from "@/src/data/profile";

// Static inline script: applies the saved theme before first paint (no user input is interpolated).
const themeScript = `
  try {
    var dark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  } catch (error) {}
`;

// Display and body faces are above the fold, so they keep the default preload.
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], display: "swap" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Only used for small numerals and code, so it should not compete with the hero for bandwidth.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Ayush Chougula",
    "AI Systems Engineer",
    "AI engineer Pune",
    "voice AI agents",
    "agentic workflows",
    "RAG systems",
    "full-stack AI products",
    "Next.js",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  applicationName: SITE_NAME,
  // No `alternates.canonical` here: child routes would inherit it. Each page sets its own (see lib/seo.ts).
  // Icons come from app/icon.png and app/apple-icon.png (file conventions).
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4eb" },
    { media: "(prefers-color-scheme: dark)", color: "#20211e" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  url: SITE_URL,
  image: absoluteUrl("/profile.png"),
  jobTitle: "AI Systems Engineer",
  email: profile.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  sameAs: [profile.github, profile.linkedin],
};

// Escape "<" so no string in the data can close the script element.
const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Font variables sit on <html> because Tailwind's theme (--font-sans, --font-mono) is declared on :root.
  // data-scroll-behavior: Next 16 only suspends the CSS smooth scrolling during route changes when this is set.
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${jetbrainsMono.variable} ${display.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased bg-background text-foreground relative min-h-screen flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
        <Navbar />
        <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

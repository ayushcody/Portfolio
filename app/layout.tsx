import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./portfolio.css";
import Navbar from "@/components/Navbar";

const themeScript = `
  try {
    var dark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  } catch (error) {}
`;

const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], display: "swap" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ayush.design"),
  title: {
    default: "Ayush Chougula | AI, Data & Full-Stack Engineer",
    template: "%s | Ayush Chougula",
  },
  description: "Portfolio of Ayush Chougula, an AI, data, and full-stack engineer building GenAI systems, ML/data workflows, RAG pipelines, cloud-backed products, and recruiter-ready proof of work.",
  keywords: [
    "Ayush Chougula",
    "portfolio",
    "AI Engineer",
    "Full Stack Developer",
    "Machine Learning Engineer",
    "Data Scientist",
    "GenAI Engineer",
    "LLM Engineer",
    "RAG Pipelines",
    "Next.js Developer",
    "Cloud Engineer",
    "Software Engineering Intern",
    "AI Internship",
    "Web Development Portfolio",
  ],
  authors: [{ name: "Ayush Chougula", url: "https://ayush.design" }],
  creator: "Ayush Chougula",
  applicationName: "Ayush Chougula Portfolio",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ayush.design",
    title: "Ayush Chougula | AI, Data & Full-Stack Engineer",
    description: "Recruiter-friendly portfolio with AI, ML/data, full-stack, cloud, and security projects.",
    siteName: "Ayush Chougula Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Chougula | AI, Data & Full-Stack Engineer",
    description: "Building GenAI systems, ML workflows, and full-stack products.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ayush Chougula",
    url: "https://ayush.design",
    jobTitle: "AI, Data & Full-Stack Engineer",
    email: "ayushchougula1@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    sameAs: [
      "https://github.com/ayushcody",
      "https://linkedin.com/in/ayushchougula"
    ]
  };

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${display.variable} antialiased bg-background text-foreground relative min-h-screen flex flex-col`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

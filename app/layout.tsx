import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import BootLoader from "@/components/BootLoader";

const bootStateScript = `
  try {
    var booted = sessionStorage.getItem('ayush-portfolio-booted-v2') === 'true';
    document.documentElement.dataset.booting = booted ? 'false' : 'true';
    document.documentElement.dataset.bootSkip = booted ? 'true' : 'false';
  } catch (error) {
    document.documentElement.dataset.booting = 'true';
  }
`;

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
    email: "ayushchougula@gmail.com",
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
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-purple/30 selection:text-white bg-background text-foreground relative min-h-screen flex flex-col`}
      >
        <script dangerouslySetInnerHTML={{ __html: bootStateScript }} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BootLoader />
        <Background />
        <Navbar />
        <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

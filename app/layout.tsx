import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";

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
  title: "Ayush Chougula | AI Systems Engineer",
  description: "Portfolio of Ayush Chougula — AI/ML Engineer building production-grade AI systems, agentic workflows, and RAG pipelines.",
  keywords: ["AI Engineer", "LLM Engineer", "Machine Learning Engineer", "Agentic AI", "Next.js", "AI Architecture"],
  authors: [{ name: "Ayush Chougula" }],
  openGraph: {
    title: "Ayush Chougula | AI Systems Engineer",
    description: "Designing and building production-grade AI systems.",
    url: "https://ayush.design",
    siteName: "Ayush Chougula Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Chougula | AI Systems Engineer",
    description: "Designing and building production-grade AI systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-purple/30 selection:text-white bg-background text-foreground relative`}
      >
        <Background />
        {children}
      </body>
    </html>
  );
}

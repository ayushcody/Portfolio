import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ayush Chougula — Designer/Developer Who Ships",
  description: "A curated portfolio of Ayush Chougula, a designer and developer who builds systems that scale and products people love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} antialiased selection:bg-accent-2 selection:text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "@/components/secondary-pages.css";
import "@/components/editorial.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Head home, browse the projects, or get in touch.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="secondary-page editorial-page notfound-page">
      <div className="notfound-main">
        <div className="secondary-shell notfound-layout">
          <p className="notfound-code" aria-hidden="true">
            4<span className="notfound-zero">0</span>4
          </p>
          <div className="notfound-copy">
            <h1>
              <span className="visually-hidden">404. </span>
              Nothing built here<span className="accent-period">.</span> Yet<span className="accent-period">.</span>
            </h1>
            <p className="secondary-lead">The link may be old, or the page has moved. Try one of these instead.</p>
            <div className="editorial-actions">
              <Link href="/" className="brutal-button"><ArrowLeft size={18} aria-hidden="true" /> Back home</Link>
              <Link href="/projects" className="brutal-button brutal-button--secondary">See the projects <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/#contact" className="text-link">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

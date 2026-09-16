import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/config/portfolio";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Instrument_Serif } from "next/font/google";
import "./signature-footer.css";

// The footer sits far below the fold, so its display face must not be preloaded ahead of the hero.
const footerSerif = Instrument_Serif({
  variable: "--font-footer-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const footerLinks = [
  { label: "Work", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/skills" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Resume", href: "/resume" },
];

export function SignatureFooter() {
  return (
    <footer className={`${footerSerif.variable} signature-footer relative z-10 px-4 pb-8 pt-6 md:px-6`}>
      <div className="footer-panel px-6 py-10 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <p className="footer-statement max-w-sm text-[28px] leading-[1.15] tracking-normal md:text-[34px]">
              Build AI systems that are useful, grounded, and shipped.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about#contact"
                className="footer-button footer-button-secondary px-6 py-3 text-xs font-black uppercase tracking-widest"
              >
                Contact via About
              </Link>
              <Link
                href="/projects"
                className="footer-button footer-button-primary px-6 py-3 text-xs font-black uppercase tracking-widest"
              >
                View Work
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm md:col-span-2 md:grid-cols-3">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest">Navigation</p>
              <nav aria-label="Footer" className="footer-muted space-y-3">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-nav-link block">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest">Focus</p>
              <div className="footer-muted space-y-3">
                <p>GenAI Systems</p>
                <p>RAG Pipelines</p>
                <p>Full-Stack AI</p>
                <p>LLM Evaluation</p>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest">Connect</p>
              <div className="flex gap-3">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="footer-social-link">
                  <Github className="h-5 w-5" aria-hidden="true" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="footer-social-link">
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </a>
                <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className="footer-social-link">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-name-wrap">
          <TextHoverEffect text="Ayush Chougula" />
        </div>
      </div>

      <div className="footer-colophon mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs font-semibold md:flex-row md:items-center md:justify-between">
        <p>© 2026 Ayush Chougula</p>
        <p>Made with love by Ayush Chougula · Pune, India</p>
      </div>
    </footer>
  );
}

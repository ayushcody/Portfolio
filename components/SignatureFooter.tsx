import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/config/portfolio";

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
    <footer className="relative z-10 bg-[#f4f4f2] px-4 pb-8 pt-4 text-black md:px-6">
      <div className="rounded-[18px] bg-white px-6 py-10 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <p className="max-w-sm text-[28px] font-black leading-[1.05] tracking-normal md:text-[34px]">
              Build AI systems that are useful, grounded, and shipped.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about#contact"
                className="border border-black/10 px-6 py-3 text-xs font-black uppercase tracking-widest transition hover:bg-black hover:text-white"
              >
                Contact via About
              </Link>
              <Link
                href="/projects"
                className="bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black/80"
              >
                View Work
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm md:col-span-2 md:grid-cols-3">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest">Navigation</p>
              <div className="space-y-3 text-black/60">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block transition hover:text-black">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest">Focus</p>
              <div className="space-y-3 text-black/60">
                <p>GenAI Systems</p>
                <p>RAG Pipelines</p>
                <p>Full-Stack AI</p>
                <p>LLM Evaluation</p>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest">Connect</p>
              <div className="flex gap-3">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-black/55 transition hover:text-black">
                  <Github className="h-5 w-5" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-black/55 transition hover:text-black">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email" className="text-black/55 transition hover:text-black">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="-mx-5 mt-10 w-[calc(100%+2.5rem)] overflow-visible md:-mx-9 md:mt-16 md:w-[calc(100%+4.5rem)]">
          <svg
            viewBox="0 0 1410 255"
            role="img"
            aria-label="AyushChougula"
            className="signature-name block h-auto w-full max-w-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="ayush-signature-outline" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#66d4ff" />
                <stop offset="28%" stopColor="#7a86ff" />
                <stop offset="52%" stopColor="#ff8de3" />
                <stop offset="76%" stopColor="#ff8a31" />
                <stop offset="100%" stopColor="#ef7dff" />
              </linearGradient>
            </defs>
            <text
              className="text-[202px] md:text-[212px]"
              x="50.35%"
              y="73%"
              textAnchor="middle"
              fill="transparent"
              stroke="url(#ayush-signature-outline)"
              strokeWidth="1.45"
              paintOrder="stroke"
              vectorEffect="non-scaling-stroke"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="202"
              fontWeight="800"
              letterSpacing="1"
            >
              AyushChougula
            </text>
          </svg>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs font-semibold text-black/55 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Ayush Chougula</p>
        <p>Made with love by Ayush Chougula · Pune, India</p>
      </div>
    </footer>
  );
}

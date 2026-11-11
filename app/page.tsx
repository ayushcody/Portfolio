import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { HomeMotion } from "@/components/motion/HomeMotion";
import Achievements from "@/components/Achievements";
import { ContactInvitation, SelectedWork, Toolkit, WorkingStyle, WritingNote } from "@/components/PortfolioSections";
import Experience from "@/components/Experience";
import { SignatureFooter } from "@/components/SignatureFooter";
import { getPublicExperience, getPublicProfile } from "@/lib/cms/publicReads";
import { getBlogPosts } from "@/lib/markdown";

// Static at build time; admin CMS changes appear within five minutes (ISR).
export const revalidate = 300;

// Title, description, Open Graph and Twitter come from the root layout; only the canonical is page-specific.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const posts = getBlogPosts();
  const [profileResult, experienceResult] = await Promise.all([
    getPublicProfile(),
    getPublicExperience(),
  ]);

  return (
    <main className="portfolio-home">
      <Hero profile={profileResult.data} />
      <SelectedWork />
      <WorkingStyle />
      <Experience experiences={experienceResult.data} />
      <Achievements />
      <WritingNote posts={posts} />
      <Toolkit profile={profileResult.data} />
      <ContactInvitation profile={profileResult.data} />
      <SignatureFooter />
      <HomeMotion />
    </main>
  );
}

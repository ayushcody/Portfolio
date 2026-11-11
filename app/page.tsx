import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { HomeMotion } from "@/components/motion/HomeMotion";
import Achievements from "@/components/Achievements";
import { ContactInvitation, SelectedWork, Toolkit, WritingNote } from "@/components/PortfolioSections";
import Experience from "@/components/Experience";
import { SignatureFooter } from "@/components/SignatureFooter";
import { getPublicExperience, getPublicProfile } from "@/lib/cms/publicReads";
import { getBlogPosts } from "@/lib/markdown";
import { getSkillGroups } from "@/lib/projects";

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
  const experience = experienceResult.data;
  // Only what the hero needs crosses into the client bundle.
  const heroRoles = experience.map(({ company, role, period, techStack }) => ({ company, role, period, techStack }));
  const specialties = getSkillGroups()
    .filter((group) => group.specialty)
    .map((group) => ({ label: group.specialty as string, href: `/skills#${group.id}` }));

  // Visitor path: who and what now, the work, the roles, recognition, writing, tools, then contact.
  return (
    <main className="portfolio-home">
      <Hero profile={profileResult.data} experience={heroRoles} specialties={specialties} />
      <SelectedWork />
      <Experience experiences={experience} />
      <Achievements />
      <WritingNote posts={posts} />
      <Toolkit profile={profileResult.data} />
      <ContactInvitation profile={profileResult.data} />
      <SignatureFooter />
      <HomeMotion />
    </main>
  );
}

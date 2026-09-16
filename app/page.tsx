import Hero from "@/components/Hero";
import Achievements from "@/components/Achievements";
import { ContactInvitation, SelectedWork, Toolkit, WorkingStyle, WritingNote } from "@/components/PortfolioSections";
import Experience from "@/components/Experience";
import { SignatureFooter } from "@/components/SignatureFooter";
import { getPublicExperience, getPublicProfile, getPublicProjects } from "@/lib/cms/publicReads";
import { getBlogPosts } from "@/lib/markdown";

// Static at build time; admin CMS changes appear within five minutes (ISR).
export const revalidate = 300;

export default async function Home() {
  const posts = getBlogPosts();
  const [profileResult, projectsResult, experienceResult] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicExperience(),
  ]);

  return (
    <main className="portfolio-home">
      <Hero profile={profileResult.data} />
      <SelectedWork projects={projectsResult.data} />
      <WorkingStyle />
      <Experience experiences={experienceResult.data} />
      <Achievements />
      <Toolkit profile={profileResult.data} />
      <WritingNote posts={posts} />
      <ContactInvitation profile={profileResult.data} />
      <SignatureFooter />
    </main>
  );
}

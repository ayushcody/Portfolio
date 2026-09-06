import Hero from "@/components/Hero";
import Achievements from "@/components/Achievements";
import { ContactInvitation, SelectedWork, Toolkit, WorkingStyle, WritingNote } from "@/components/PortfolioSections";
import Experience from "@/components/Experience";
import { SignatureFooter } from "@/components/SignatureFooter";
import { getPublicProfile } from "@/lib/cms/publicReads";
import { getBlogPosts } from "@/lib/markdown";

export default async function Home() {
  const posts = getBlogPosts();
  const profileResult = await getPublicProfile();

  return (
    <main className="portfolio-home">
      <Hero profile={profileResult.data} />
      <SelectedWork />
      <WorkingStyle />
      <Experience />
      <Achievements />
      <Toolkit profile={profileResult.data} />
      <WritingNote posts={posts} />
      <ContactInvitation profile={profileResult.data} />
      <SignatureFooter />
    </main>
  );
}

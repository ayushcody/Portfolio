import Hero from "@/components/Hero";
import { CredibilityStrip } from "@/components/CredibilityStrip";
import SelectedProjects from "@/components/SelectedProjects";
import HowIBuild from "@/components/HowIBuild";
import Experience from "@/components/Experience";
import Interests from "@/components/Interests";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import LatestPosts from "@/components/LatestPosts";
import { SignatureFooter } from "@/components/SignatureFooter";
import { getPublicProfile } from "@/lib/cms/publicReads";
import { getBlogPosts } from "@/lib/markdown";

export default async function Home() {
  const posts = getBlogPosts();
  const profileResult = await getPublicProfile();

  return (
    <main className="min-h-screen selection:bg-accent-2 selection:text-white">
      <Hero profile={profileResult.data} profileSource={profileResult.source} />
      <CredibilityStrip />
      <SelectedProjects />
      <HowIBuild />
      <Experience />
      <Interests />
      <Skills />
      <Achievements />
      <LatestPosts posts={posts} />
      <SignatureFooter />
    </main>
  );
}

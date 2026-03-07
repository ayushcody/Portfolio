import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SelectedProjects from "@/components/SelectedProjects";
import Experience from "@/components/Experience";
import Interests from "@/components/Interests";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-accent-2 selection:text-white">
      <Navbar />
      <Hero />
      <SelectedProjects />
      <Experience />
      <Interests />
      <Achievements />
      <Contact />
    </main>
  );
}

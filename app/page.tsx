import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SelectedProjects from "@/components/SelectedProjects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Interests from "@/components/Interests";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-accent-2 selection:text-white">
      <Navbar />
      <Hero />
      <SelectedProjects />
      <Skills />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}

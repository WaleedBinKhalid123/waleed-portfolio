import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Certifications } from "@/components/sections/Certifications";

/**
 * Section order follows priority, not chronology: who I am, what I work with,
 * where I've done it, what came out of it, then the supporting credentials and
 * finally the conversion step.
 *
 * The page is statically rendered and revalidated daily — durations for current
 * roles ("2 years 5 months") are derived at render time, so a page cached
 * indefinitely would slowly go stale.
 */
export const revalidate = 86_400;

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Certifications />
      <Contact />
    </>
  );
}

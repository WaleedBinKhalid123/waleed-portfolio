import type { ReactNode } from "react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Projects() {
  if (projects.length === 0) return null;

  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  // Compact cards are rendered here, on the server, and handed to the client
  // grid — which decides visibility only, and never re-renders a card.
  const cards: Record<string, ReactNode> = Object.fromEntries(
    rest.map((project, index) => [
      project.id,
      // Staggered a row at a time (three columns) as the grid scrolls in.
      <Reveal key={project.id} delay={Math.floor(index / 3) * 60} distance={12} className="h-full">
        <ProjectCard project={project} index={featured.length + index} />
      </Reveal>,
    ]),
  );

  return (
    <Section id="projects" labelledBy="projects-heading">
      <SectionHeading
        id="projects-heading"
        index="04"
        eyebrow="Projects"
        title="Selected work"
        description="A few projects that show how I approach architecture, data modelling and interface design."
      />

      {featured.length > 0 ? (
        <div className="mt-12 flex flex-col gap-6 sm:gap-8">
          {featured.map((project, index) => (
            <Reveal key={project.id} distance={20}>
              <ProjectCard
                project={project}
                index={index}
                variant="featured"
                reversed={index % 2 === 1}
                priority={index === 0}
              />
            </Reveal>
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div className="mt-16 border-t pt-12 sm:mt-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="eyebrow">More work</h3>
            <p className="font-mono text-xs text-subtle">Filter by technology</p>
          </div>

          <div className="mt-6">
            <ProjectGrid projects={rest} cards={cards} />
          </div>
        </div>
      ) : null}
    </Section>
  );
}

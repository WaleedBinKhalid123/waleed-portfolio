"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";
import { useMemo, useState, type ReactNode } from "react";

interface ProjectGridProps {
  projects: Project[];
  /** One pre-rendered card per project, keyed by id. */
  cards: Record<string, ReactNode>;
  /** A technology needs at least this many projects to earn a filter chip. */
  minimumUses?: number;
}

const ALL = "All";

/**
 * Technology filter for the secondary project grid.
 *
 * Chips come from the data — a technology earns one only when it appears in
 * enough projects to be worth filtering by, so the row stays short as the
 * portfolio grows. Cards are rendered on the server and passed in; this
 * component only decides which are shown, so every project stays in the HTML.
 */
export function ProjectGrid({ projects, cards, minimumUses = 2 }: ProjectGridProps) {
  const [technology, setTechnology] = useState<string>(ALL);

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const item of project.technologies) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }

    return [
      { name: ALL, count: projects.length },
      ...[...counts.entries()]
        .filter(([, count]) => count >= minimumUses)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [projects, minimumUses]);

  const visibleIds = useMemo(() => {
    const matching =
      technology === ALL
        ? projects
        : projects.filter((project) => project.technologies.includes(technology));
    return new Set(matching.map((project) => project.id));
  }, [projects, technology]);

  return (
    <div>
      {filters.length > 1 ? (
        <div
          role="tablist"
          aria-label="Filter projects by technology"
          className="-mx-1 flex flex-wrap gap-1.5 px-1"
        >
          {filters.map((filter) => {
            const isActive = filter.name === technology;

            return (
              <button
                key={filter.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTechnology(filter.name)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200",
                  isActive
                    ? "border-accent/40 bg-accent-soft text-foreground"
                    : "text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {filter.name}
                <span
                  className={cn(
                    "font-mono text-[0.6875rem]",
                    isActive ? "text-accent" : "text-subtle",
                  )}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        Showing {visibleIds.size} of {projects.length} projects
        {technology === ALL ? "" : ` using ${technology}`}.
      </p>

      {/* Keyed on the filter, so changing it replays each card's reveal. */}
      <ul key={technology} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id} className={cn(!visibleIds.has(project.id) && "hidden")}>
            {cards[project.id]}
          </li>
        ))}
      </ul>
    </div>
  );
}

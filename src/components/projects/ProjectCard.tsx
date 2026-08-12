import { cn } from "@/lib/utils";
import { formatMonthYear } from "@/lib/date";
import type { Project } from "@/types/portfolio";
import { TagList } from "@/components/ui/TagList";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectMedia } from "@/components/projects/ProjectMedia";

interface ProjectCardProps {
  project: Project;
  /** Position in the list, rendered as an editorial "01" marker. */
  index: number;
  variant?: "featured" | "compact";
  /** Featured cards alternate the media side to give the column rhythm. */
  reversed?: boolean;
  /** Only the first image above the fold should preload. */
  priority?: boolean;
}

export function ProjectCard({
  project,
  index,
  variant = "compact",
  reversed = false,
  priority = false,
}: ProjectCardProps) {
  const {
    title,
    description,
    longDescription,
    technologies,
    image,
    images,
    githubUrl,
    liveUrl,
    caseStudyUrl,
    features,
    role,
    date,
  } = project;

  const marker = String(index + 1).padStart(2, "0");
  const isFeatured = variant === "featured";
  const meta = [role, formatMonthYear(date)].filter(Boolean).join(" · ");
  const headingId = `project-${project.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "group card card-interactive overflow-hidden rounded-xl",
        isFeatured ? "grid lg:grid-cols-2" : "flex h-full flex-col",
      )}
    >
      <ProjectMedia
        src={image}
        images={images}
        title={title}
        technologies={technologies}
        index={marker}
        priority={priority}
        variant={variant}
        sizes={
          isFeatured
            ? "(min-width: 1024px) 50vw, 100vw"
            : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        }
        className={cn(isFeatured && reversed && "lg:order-2")}
      />

      <div
        className={cn(
          "flex flex-col",
          isFeatured ? "p-6 sm:p-8 lg:justify-center" : "flex-1 p-5 sm:p-6",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-subtle">{marker}</span>
          {meta ? (
            <>
              <span aria-hidden="true" className="h-px w-5 bg-border-strong" />
              <span className="font-mono text-xs text-subtle">{meta}</span>
            </>
          ) : null}
          {isFeatured ? (
            <span className="ml-auto rounded-full bg-accent-soft px-2.5 py-1 text-[0.6875rem] font-medium text-accent">
              Featured
            </span>
          ) : null}
        </div>

        <h3
          id={headingId}
          className={cn(
            "mt-3 font-medium tracking-tight",
            isFeatured ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
          )}
        >
          {title}
        </h3>

        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          {isFeatured ? (longDescription ?? description) : description}
        </p>

        {isFeatured && features?.length ? (
          <ul className="mt-4 space-y-2">
            {features.map((feature) => (
              <li
                key={feature.slice(0, 40)}
                className="relative pl-5 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2.25 left-0 h-px w-2.5 bg-border-strong"
                />
                {feature}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Keeps tags and links pinned to the bottom of compact cards. */}
        <div className={cn(!isFeatured && "mt-auto")}>
          <TagList
            items={technologies}
            max={isFeatured ? 10 : 5}
            label={`Technologies used in ${title}`}
            // Marks only on the featured cards, which have the room for them.
            withIcons={isFeatured}
            className="mt-5"
          />

          <ProjectLinks
            title={title}
            githubUrl={githubUrl}
            liveUrl={liveUrl}
            caseStudyUrl={caseStudyUrl}
            className="mt-5"
          />
        </div>
      </div>
    </article>
  );
}

import { cn } from "@/lib/utils";
import { FiArrowUpRight } from "react-icons/fi";
import { TagList } from "@/components/ui/TagList";
import type { Experience } from "@/types/portfolio";
import { CredentialMark } from "@/components/ui/CredentialMark";
import { calculateDuration, formatDateRange, formatYear } from "@/lib/date";

interface ExperienceItemProps {
  experience: Experience;
  /** The last entry stops the rail rather than running it off the section. */
  isLast?: boolean;
}

/**
 * One role on the timeline.
 *
 * The rail and node animate through CSS driven by the `data-visible` attribute
 * the parent `Reveal` sets, so the line draws itself downward as each entry
 * comes into view — with no scroll listener and no per-frame JavaScript.
 */
export function ExperienceItem({ experience, isLast = false }: ExperienceItemProps) {
  const {
    company,
    role,
    location,
    employmentType,
    startDate,
    endDate,
    current,
    summary,
    achievements,
    technologies,
    logo,
    icon,
    companyUrl,
  } = experience;

  // Both strings are derived from the structured dates — never authored.
  const range = formatDateRange(startDate, endDate, current);
  const duration = calculateDuration(startDate, current ? undefined : endDate);
  const startYear = formatYear(startDate);

  const meta = [location, employmentType].filter(Boolean).join(" · ");

  return (
    <div className="relative grid gap-x-8 gap-y-6 pb-12 sm:pb-14 lg:grid-cols-12">
      {/* Rail track, with the animated fill drawing over it. */}
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-0 left-1.75 w-px overflow-hidden bg-border"
        >
          <span
            className={cn(
              "timeline-rail block h-full w-full",
              current ? "bg-accent/45" : "bg-border-strong",
            )}
          />
        </span>
      ) : null}

      {/* The current role gets the same slow halo as the availability marker. */}
      <span
        aria-hidden="true"
        className={cn(
          "timeline-node absolute top-1.5 left-0 flex size-3.75 items-center justify-center rounded-full border-[3px] border-background",
          current ? "bg-accent" : "bg-border-strong",
        )}
      >
        {current ? (
          <span className="absolute size-2.25 animate-status-pulse rounded-full bg-accent" />
        ) : null}
      </span>

      <div className="pl-8 lg:col-span-3 lg:pl-8">
        <p className="font-mono text-lg leading-none font-medium tracking-tight text-foreground/90">
          {startYear}
        </p>
        <p className="mt-2.5 font-mono text-xs tracking-tight text-muted">{range}</p>
        {duration.label ? <p className="mt-1.5 text-xs text-subtle">{duration.label}</p> : null}
      </div>

      <div className="pl-8 lg:col-span-9 lg:pl-0">
        <div className="flex items-start gap-4">
          <CredentialMark src={logo} icon={icon} name={company} size={44} className="mt-0.5" />

          <div className="min-w-0">
            <h3 className="text-base leading-snug font-medium tracking-tight sm:text-lg">{role}</h3>

            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              {companyUrl ? (
                <a
                  href={companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-foreground transition-colors hover:text-accent"
                >
                  {company}
                  <FiArrowUpRight aria-hidden="true" className="arrow-ne size-3.5" />
                </a>
              ) : (
                <span className="text-foreground">{company}</span>
              )}

              {meta ? (
                <>
                  <span aria-hidden="true" className="text-border-strong">
                    ·
                  </span>
                  <span>{meta}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{summary}</p>

        {achievements?.length ? (
          <ul className="mt-5 space-y-2.5">
            {achievements.map((achievement) => (
              <li
                key={achievement.slice(0, 40)}
                className="relative pl-5 text-[0.9375rem] leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2.75 left-0 h-px w-2.5 bg-border-strong"
                />
                {achievement}
              </li>
            ))}
          </ul>
        ) : null}

        {technologies?.length ? (
          <TagList
            items={technologies}
            max={10}
            label={`Technologies used at ${company}`}
            className="mt-5"
          />
        ) : null}
      </div>
    </div>
  );
}

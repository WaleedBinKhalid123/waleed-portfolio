import { FiArrowUpRight } from "react-icons/fi";
import type { Education } from "@/types/portfolio";
import { formatDateRange, formatYear } from "@/lib/date";
import { CredentialMark } from "@/components/ui/CredentialMark";

interface EducationItemProps {
  education: Education;
  isLast?: boolean;
}

/** One qualification, on the same timeline treatment as the experience section. */
export function EducationItem({ education, isLast = false }: EducationItemProps) {
  const {
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    current,
    location,
    description,
    achievements,
    logo,
    icon,
    institutionUrl,
  } = education;

  const range = formatDateRange(startDate, endDate, current);
  const endYear = formatYear(endDate) || formatYear(startDate);

  return (
    <div className="relative grid gap-x-8 gap-y-5 pb-10 sm:pb-12 lg:grid-cols-12">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-0 left-1.75 w-px overflow-hidden bg-border"
        >
          <span className="timeline-rail block h-full w-full bg-border-strong" />
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className="timeline-node absolute top-1.5 left-0 size-3.75 rounded-full border-[3px] border-background bg-border-strong"
      />

      <div className="pl-8 lg:col-span-3">
        <p className="font-mono text-lg leading-none font-medium tracking-tight text-foreground/90">
          {endYear}
        </p>
        {range ? <p className="mt-2.5 font-mono text-xs tracking-tight text-muted">{range}</p> : null}
        {location ? <p className="mt-1.5 text-xs text-subtle">{location}</p> : null}
      </div>

      <div className="pl-8 lg:col-span-9 lg:pl-0">
        <div className="flex items-start gap-4">
          <CredentialMark src={logo} icon={icon} name={institution} size={44} className="mt-0.5" />

          <div className="min-w-0">
            <h3 className="text-base leading-snug font-medium tracking-tight sm:text-lg">
              {degree}
            </h3>

            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              {institutionUrl ? (
                <a
                  href={institutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-foreground transition-colors hover:text-accent"
                >
                  {institution}
                  <FiArrowUpRight aria-hidden="true" className="arrow-ne size-3.5" />
                </a>
              ) : (
                <span className="text-foreground">{institution}</span>
              )}

              {fieldOfStudy ? (
                <>
                  <span aria-hidden="true" className="text-border-strong">
                    ·
                  </span>
                  <span>{fieldOfStudy}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {description ? (
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{description}</p>
        ) : null}

        {achievements?.length ? (
          <ul className="mt-4 space-y-2">
            {achievements.map((achievement) => (
              <li
                key={achievement.slice(0, 40)}
                className="relative pl-5 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2.25 left-0 h-px w-2.5 bg-border-strong"
                />
                {achievement}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

import { byMostRecent } from "@/lib/date";
import { portfolioStats } from "@/lib/stats";
import { experiences } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CollapsibleList } from "@/components/ui/CollapsibleList";
import { ExperienceItem } from "@/components/experience/ExperienceItem";

/** Older roles stay one click away rather than stretching the page. */
const VISIBLE_ROLES = 4;

export function Experience() {
  if (experiences.length === 0) return null;

  // Sorted here rather than in the data file, so entries can be added in any order.
  const ordered = [...experiences].sort(byMostRecent);
  const { totalExperience, companyCount } = portfolioStats;

  return (
    <Section id="experience" labelledBy="experience-heading">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="experience-heading"
          index="03"
          eyebrow="Experience"
          title="Professional background"
          description="Roles in reverse order, with what each one actually involved."
        />

        {totalExperience.totalMonths > 0 ? (
          <dl className="shrink-0 sm:text-right">
            <dt className="eyebrow">Total</dt>
            <dd className="mt-2 font-mono text-sm text-muted">
              {totalExperience.label}
              <span aria-hidden="true" className="mx-2 text-border-strong">
                ·
              </span>
              {companyCount} {companyCount === 1 ? "company" : "companies"}
            </dd>
          </dl>
        ) : null}
      </div>

      <CollapsibleList
        as="ol"
        visibleCount={VISIBLE_ROLES}
        itemNoun="role"
        className="mt-14"
        toggleClassName="border-t pt-4"
      >
        {ordered.map((experience, index) => (
          <Reveal as="li" key={experience.id} distance={18}>
            <ExperienceItem experience={experience} isLast={index === ordered.length - 1} />
          </Reveal>
        ))}
      </CollapsibleList>
    </Section>
  );
}

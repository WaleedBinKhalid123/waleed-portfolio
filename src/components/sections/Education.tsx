import { byMostRecent } from "@/lib/date";
import { education } from "@/data/education";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CollapsibleList } from "@/components/ui/CollapsibleList";
import { EducationItem } from "@/components/education/EducationItem";

/** Most people have two or three; the cap only matters for longer histories. */
const VISIBLE_QUALIFICATIONS = 4;

export function Education() {
  if (education.length === 0) return null;

  const ordered = [...education].sort(byMostRecent);

  return (
    <Section id="education" labelledBy="education-heading">
      <SectionHeading
        id="education-heading"
        index="05"
        eyebrow="Education"
        title="Academic background"
      />

      <CollapsibleList
        as="ol"
        visibleCount={VISIBLE_QUALIFICATIONS}
        itemNoun="qualification"
        className="mt-12"
        toggleClassName="border-t pt-4"
      >
        {ordered.map((item, index) => (
          <Reveal as="li" key={item.id} distance={18}>
            <EducationItem education={item} isLast={index === ordered.length - 1} />
          </Reveal>
        ))}
      </CollapsibleList>
    </Section>
  );
}

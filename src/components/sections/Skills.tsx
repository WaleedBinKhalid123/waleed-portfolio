import { skillGroups } from "@/data/skills";
import { portfolioStats } from "@/lib/stats";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { skillGroupIcons } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techIcons, techIconKey, techColors } from "@/components/ui/techIcons";

/**
 * Skills at scale.
 *
 * Groups are rendered as a hairline-divided panel rather than a wall of chips:
 * with eight categories and sixty-odd entries, tags stop being scannable. The
 * grid is driven entirely by the data — add a ninth group and it slots in.
 */
export function Skills() {
  if (skillGroups.length === 0) return null;

  return (
    <Section id="skills" labelledBy="skills-heading" tone="raised">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="skills-heading"
          index="02"
          eyebrow="Skills"
          title="Technical toolkit"
          description="Grouped by where they sit in the stack — no proficiency bars, since they measure nothing."
        />

        <p className="shrink-0 font-mono text-xs text-subtle">
          {portfolioStats.technologyCount} technologies · {skillGroups.length} groups
        </p>
      </div>

      <div className="mt-10">
        <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          {skillGroups.map((group, index) => {
            const Icon = group.icon ? skillGroupIcons[group.icon] : null;
            // A few standout items get a small coloured brand mark beside the
            // title; anything without a genuine mark is silently skipped.
            const highlights = (group.highlightIcons ?? [])
              .map((name) => ({ name, mark: techIcons[techIconKey(name)] }))
              .filter((entry) => Boolean(entry.mark));

            return (
              // Staggered a row at a time, so the panel assembles rather than
              // appearing all at once. Fixed min-height keeps every card the
              // same footprint regardless of how many items it lists.
              <Reveal
                as="li"
                key={group.id}
                delay={Math.floor(index / 2) * 70}
                distance={10}
                className="flex min-h-[175px] flex-col bg-background p-5 sm:min-h-[205px] sm:p-6 lg:min-h-[160px]"
              >
                <h3 className="flex items-center gap-2.5 text-sm font-medium tracking-tight">
                  {Icon ? <Icon aria-hidden="true" className="size-4 text-accent" /> : null}
                  {group.category}

                  {highlights.length > 0 ? (
                    <span aria-hidden="true" className="flex items-center gap-1.5 text-subtle">
                      <span className="text-border-strong">|</span>
                      {highlights.map(({ name, mark: Mark }) => (
                        <Mark
                          key={name}
                          className="size-4"
                          style={{ color: techColors[techIconKey(name)] }}
                        />
                      ))}
                    </span>
                  ) : null}

                  <span className="ml-auto font-mono text-[0.6875rem] text-subtle">
                    {group.items.length}
                  </span>
                </h3>

                <p className="mt-3.5 text-sm leading-relaxed text-muted">
                  {group.items.map((item, itemIndex) => (
                    <span key={item}>
                      {itemIndex > 0 ? (
                        <span aria-hidden="true" className="text-border-strong">
                          {" · "}
                        </span>
                      ) : null}
                      {item}
                    </span>
                  ))}
                </p>
              </Reveal>
            );
          })}

          {/* An odd count leaves the last row's second cell empty. A real
              card there would misrepresent the data, so this blends the gap
              into the section band instead of showing the grid's own
              (darker) background. */}
          {skillGroups.length % 2 !== 0 ? (
            <li aria-hidden="true" className="hidden bg-surface/40 sm:block" />
          ) : null}
        </ul>
      </div>
    </Section>
  );
}

import { about } from "@/data/about";
import { FiArrowRight } from "react-icons/fi";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading id="about-heading" index="01" eyebrow="About" title={about.headline} />

            <div className="mt-8 space-y-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={100}>
            {about.focusAreas?.length ? (
              <div className="card rounded-xl p-6 sm:p-7">
                <h3 className="eyebrow">Focus areas</h3>

                <ul className="mt-5 space-y-3">
                  {about.focusAreas.map((area) => (
                    <li key={area} className="flex items-start gap-2.5 text-sm text-foreground">
                      <FiArrowRight
                        aria-hidden="true"
                        className="mt-0.75 size-3.5 shrink-0 text-accent"
                      />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {about.highlights?.length ? (
              <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border bg-border">
                {about.highlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-background px-5 py-4"
                  >
                    <dt className="eyebrow">{highlight.label}</dt>
                    <dd className="text-sm text-foreground">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

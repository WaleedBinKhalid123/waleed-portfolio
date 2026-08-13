import { cn } from "@/lib/utils";
import { hero } from "@/data/hero";
import { heroStats } from "@/lib/stats";
import { siteConfig } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { experiences } from "@/data/experience";
import { Counter } from "@/components/ui/Counter";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { FiArrowDownRight, FiArrowRight } from "react-icons/fi";

interface HeroFact {
  label: string;
  value: string;
  /** Marks the availability row, which carries the status dot. */
  status?: boolean;
}

/** Facts are derived, never authored — they cannot contradict the sections below. */
function buildFacts(): HeroFact[] {
  const facts: HeroFact[] = [];

  const currentRole = experiences.find((experience) => experience.current);
  if (currentRole) {
    facts.push({ label: "Currently", value: `${currentRole.role}, ${currentRole.company}` });
  }

  facts.push({ label: "Based in", value: siteConfig.location });

  if (hero.availability) {
    facts.push({ label: "Availability", value: hero.availability, status: true });
  }

  return facts;
}

/** Keyed by count so the grid never leaves an empty trailing cell. */
const STATS_GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function Hero() {
  const facts = buildFacts();

  return (
    <section id="top" className="relative scroll-mt-24 overflow-hidden">
      {/* Ambient detail only: masked, low contrast, and never behind text it could disturb. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-144 hero-wash" />
        <div className="absolute inset-x-0 top-0 h-120 dot-grid" />
      </div>

      <Container>
        <div className="pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-24">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              {/*
                Identity block. The portrait is optional — with or without it the
                two lines carry the name and role, so nothing collapses.
              */}
              <Reveal distance={10}>
                <div className="flex items-center gap-3.5">
                  <ProfileImage
                    src={siteConfig.avatar}
                    alt={`Portrait of ${siteConfig.name}`}
                    size={52}
                    priority
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight">{siteConfig.name}</p>
                    <p className="eyebrow mt-1.5">{siteConfig.title}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <h1 className="mt-8 font-display text-[2.375rem] leading-[1.04] font-medium tracking-[-0.04em] text-balance sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.875rem]">
                  {hero.headline}
                </h1>
              </Reveal>

              <Reveal delay={180}>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-[1.0625rem]">
                  {hero.summary}
                </p>
              </Reveal>

              <Reveal delay={270}>
                <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:items-center">
                  <Button href={hero.primaryCta.href} className="group">
                    {hero.primaryCta.label}
                    <FiArrowDownRight aria-hidden="true" className="arrow-e size-4" />
                  </Button>

                  {hero.secondaryCta ? (
                    <Button href={hero.secondaryCta.href} variant="secondary" className="group">
                      {hero.secondaryCta.label}
                      <FiArrowRight aria-hidden="true" className="arrow-e size-4 text-subtle" />
                    </Button>
                  ) : null}
                </div>
              </Reveal>

              <Reveal delay={360}>
                <div className="mt-10 flex items-center gap-4">
                  <span className="eyebrow">Elsewhere</span>
                  <span aria-hidden="true" className="h-px w-8 bg-border" />
                  <SocialLinks className="-ml-2" />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-3 lg:col-start-10">
              <Reveal delay={220}>
                <dl className="divide-y border-t lg:border-t-0 lg:border-l lg:pl-8">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 lg:flex-col lg:justify-start lg:py-4"
                    >
                      <dt className="eyebrow">{fact.label}</dt>
                      <dd className="flex items-center gap-2 text-sm text-foreground lg:mt-2">
                        {fact.status ? (
                          <span
                            aria-hidden="true"
                            className="relative flex size-1.5 shrink-0 items-center justify-center"
                          >
                            <span className="absolute size-1.5 animate-status-pulse rounded-full bg-accent" />
                            <span className="relative size-1.5 rounded-full bg-accent" />
                          </span>
                        ) : null}
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>

          {/*
            Every figure is derived from the data files (see lib/stats.ts), so
            adding a project or certification updates the headline numbers.
          */}
          {heroStats.length > 0 ? (
            <Reveal delay={450}>
              <dl
                className={cn(
                  "mt-14 grid gap-px overflow-hidden rounded-xl border bg-border sm:mt-16",
                  STATS_GRID_COLS[heroStats.length] ?? "grid-cols-2 sm:grid-cols-4",
                )}
              >
                {heroStats.map((stat) => (
                  <div key={stat.id} className="bg-background px-5 py-6 sm:px-6 sm:py-7">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-3xl font-medium tracking-tight sm:text-[2.125rem]">
                        <Counter value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="eyebrow mt-2.5 block">{stat.label}</span>
                      {stat.description ? <span className="sr-only">{stat.description}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

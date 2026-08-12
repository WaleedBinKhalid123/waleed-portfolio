import type { HeroContent } from "@/types/portfolio";

/**
 * The hero deliberately holds only copy: the name, role, location and years of
 * experience it displays are read from `site.ts` and derived from
 * `experience.ts`, so they can never drift out of sync.
 */
export const hero: HeroContent = {
  availability: "Open to senior engineering roles",
  headline: "I build full-stack platforms, and the AI features that make them smarter.",
  summary:
    "Senior Software Engineer shipping full-stack platforms — React and Next.js up front, Node.js and Django behind them — plus the AI layer that makes them useful: RAG-powered search, speech-to-text, and NLP built into production systems.",
  primaryCta: { label: "View projects", href: "/#projects" },
  secondaryCta: { label: "Get in touch", href: "/#contact" },
};

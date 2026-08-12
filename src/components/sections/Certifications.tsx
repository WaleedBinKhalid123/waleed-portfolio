import type { ReactNode } from "react";
import { siteConfig } from "@/data/site";
import { SiCredly } from "react-icons/si";
import { byMostRecentIssue } from "@/lib/date";
import { FiArrowUpRight } from "react-icons/fi";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { certifications } from "@/data/certifications";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import { CertificationGallery } from "@/components/certifications/CertificationGallery";

/** Cards shown before the "Show all" control appears — three full rows. */
const VISIBLE_CERTIFICATIONS = 9;

export function Certifications() {
  if (certifications.length === 0) return null;

  // Featured first, then newest — so the strongest credentials lead regardless
  // of the order they were added to the data file.
  const ordered = [...certifications].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return byMostRecentIssue(a, b);
  });

  // Cards are rendered here, on the server, and handed to the client gallery.
  // The interactive layer decides what is *visible*; it never re-renders a card.
  const cards: Record<string, ReactNode> = Object.fromEntries(
    ordered.map((certification, index) => [
      certification.id,
      // Staggered a row at a time (three columns), so the grid fills in
      // sequence instead of flashing into place.
      <Reveal key={certification.id} delay={Math.floor(index / 3) * 60} distance={12}>
        <CertificationCard certification={certification} />
      </Reveal>,
    ]),
  );

  return (
    <Section id="certifications" labelledBy="certifications-heading" tone="raised">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="certifications-heading"
          index="06"
          eyebrow="Certifications"
          title="Credentials"
          description={`${certifications.length} professional certifications, filterable by category.`}
        />

        {/* Only rendered when a Credly profile is configured. */}
        {siteConfig.socialLinks.credly ? (
          <a
            href={siteConfig.socialLinks.credly}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <SiCredly aria-hidden="true" className="size-4" />
            Verified badges on Credly
            <FiArrowUpRight aria-hidden="true" className="arrow-ne size-3.5 text-subtle" />
          </a>
        ) : null}
      </div>

      <div className="mt-10">
        <CertificationGallery
          certifications={ordered}
          cards={cards}
          visibleCount={VISIBLE_CERTIFICATIONS}
        />
      </div>
    </Section>
  );
}

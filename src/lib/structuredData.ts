import { siteConfig } from "@/data/site";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";

/**
 * schema.org `Person` markup, derived from the same data files that drive the
 * page itself — add a role or a degree and this updates with it, rather than
 * drifting out of sync with what the page actually says.
 *
 * This is what lets a search engine show a richer result (name, role, links)
 * for a query naming you directly. It does not influence ranking for broad,
 * competitive terms — no on-page markup does.
 */
export function buildPersonJsonLd() {
  const currentRole = experiences.find((experience) => experience.current);

  const sameAs = [
    siteConfig.socialLinks.linkedin,
    siteConfig.socialLinks.github,
    siteConfig.socialLinks.x,
    siteConfig.socialLinks.website,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    ...(siteConfig.avatar
      ? { image: new URL(siteConfig.avatar, siteConfig.url).toString() }
      : {}),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location,
    },
    ...(currentRole
      ? {
          worksFor: {
            "@type": "Organization",
            name: currentRole.company,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(education.length
      ? {
          alumniOf: education.map((entry) => ({
            "@type": "EducationalOrganization",
            name: entry.institution,
          })),
        }
      : {}),
  };
}

/**
 * `<` is escaped so the serialised JSON can never be misread as closing the
 * surrounding `<script>` tag — relevant since some of this text (description,
 * company names) comes from `src/data`, not a hardcoded literal.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

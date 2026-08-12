import type { ContactChannel, ContactContent } from "@/types/portfolio";
import { siteConfig } from "@/data/site";

/**
 * Contact channels are derived from `siteConfig` so an address or profile URL
 * is only ever written once. A channel is omitted entirely when its underlying
 * value is missing — no empty rows, no dead links.
 */
function buildChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [
    {
      id: "email",
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      icon: "email",
    },
  ];

  if (siteConfig.phone) {
    channels.push({
      id: "phone",
      label: "Phone",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/\s+/g, "")}`,
      icon: "phone",
    });
  }

  channels.push({
    id: "location",
    label: "Location",
    value: siteConfig.location,
    icon: "location",
  });

  if (siteConfig.socialLinks.github) {
    channels.push({
      id: "github",
      label: "GitHub",
      value: siteConfig.socialLinks.github.replace(/^https?:\/\/(www\.)?/, ""),
      href: siteConfig.socialLinks.github,
      icon: "github",
      external: true,
    });
  }

  if (siteConfig.socialLinks.linkedin) {
    channels.push({
      id: "linkedin",
      label: "LinkedIn",
      value: siteConfig.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      href: siteConfig.socialLinks.linkedin,
      icon: "linkedin",
      external: true,
    });
  }

  if (siteConfig.socialLinks.credly) {
    channels.push({
      id: "credly",
      label: "Credly",
      value: "Verified badges",
      href: siteConfig.socialLinks.credly,
      icon: "credly",
      external: true,
    });
  }

  if (siteConfig.resumeUrl) {
    channels.push({
      id: "resume",
      label: "Résumé",
      value: "Download PDF",
      href: siteConfig.resumeUrl,
      icon: "resume",
    });
  }

  return channels;
}

export const contactContent: ContactContent = {
  headline: "Let's talk about your project.",
  description:
    "I'm open to senior engineering roles, contract work and technical consulting. Send a short outline of what you're building and I'll get back to you.",
  availability: "Typically replies within two working days.",
  channels: buildChannels(),
};

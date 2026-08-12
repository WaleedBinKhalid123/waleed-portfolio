import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import { FiArrowUpRight, FiFileText, FiGithub } from "react-icons/fi";

interface ProjectLinksProps {
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  /** Project title, used to keep the links distinguishable to screen readers. */
  title: string;
  className?: string;
}

interface ResolvedLink {
  key: string;
  label: string;
  href: string;
  icon: IconType;
  /** The primary action gets the arrow that travels on hover. */
  arrow?: boolean;
}

/**
 * Renders one link per URL that exists — and nothing at all when none do, so a
 * project without a public repo never shows an empty or dead button.
 */
export function ProjectLinks({
  githubUrl,
  liveUrl,
  caseStudyUrl,
  title,
  className,
}: ProjectLinksProps) {
  const links: ResolvedLink[] = [];

  if (liveUrl) {
    links.push({ key: "live", label: "Live demo", href: liveUrl, icon: FiArrowUpRight, arrow: true });
  }
  if (githubUrl) links.push({ key: "code", label: "Source", href: githubUrl, icon: FiGithub });
  if (caseStudyUrl) {
    links.push({ key: "case", label: "Case study", href: caseStudyUrl, icon: FiFileText });
  }

  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {links.map(({ key, label, href, icon: Icon, arrow }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 py-1 text-sm text-foreground transition-colors hover:text-accent"
          >
            {arrow ? null : <Icon aria-hidden="true" className="size-4" />}
            {label}
            {arrow ? (
              <Icon
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            ) : null}
            <span className="sr-only"> — {title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

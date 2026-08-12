import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { socialIcons, socialLabels } from "@/components/ui/icons";
import type { SocialLinks as SocialLinksMap } from "@/types/portfolio";

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
  /** Icon-only links are used in the header; labels are used inline in prose. */
  variant?: "icon" | "labelled";
}

/**
 * Renders only the profiles that are actually configured — an unset network
 * produces no link rather than a dead one.
 */
export function SocialLinks({
  className,
  iconClassName,
  variant = "icon",
}: SocialLinksProps) {
  const entries = (Object.keys(siteConfig.socialLinks) as Array<keyof SocialLinksMap>)
    .map((key) => ({ key, href: siteConfig.socialLinks[key] }))
    .filter((entry): entry is { key: keyof SocialLinksMap; href: string } => Boolean(entry.href));

  if (entries.length === 0) return null;

  return (
    <ul className={cn("flex items-center", variant === "icon" ? "gap-1" : "gap-5", className)}>
      {entries.map(({ key, href }) => {
        const Icon = socialIcons[key];
        const label = socialLabels[key];

        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={variant === "icon" ? label : undefined}
              className={cn(
                "inline-flex items-center gap-2 text-muted transition-colors duration-200 hover:text-foreground",
                variant === "icon"
                  ? "size-9 justify-center rounded-md hover:bg-elevated"
                  : "py-1 text-sm",
              )}
            >
              <Icon aria-hidden="true" className={cn("size-[1.05rem]", iconClassName)} />
              {variant === "labelled" ? label : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

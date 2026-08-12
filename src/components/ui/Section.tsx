import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface SectionProps {
  /** Anchor target used by the navigation. */
  id: string;
  children: ReactNode;
  className?: string;
  /** Hairline rule above the section. */
  divider?: boolean;
  /** Id of the heading that names this region, for assistive technology. */
  labelledBy?: string;
  /**
   * `raised` tints the band very slightly. Used on the supporting sections so a
   * long page reads as chapters rather than one continuous scroll — two bands,
   * not stripes.
   */
  tone?: "default" | "raised";
}

/**
 * Consistent vertical rhythm and landmark semantics for every page section.
 * `scroll-mt` keeps anchored headings clear of the sticky header.
 */
export function Section({
  id,
  children,
  className,
  divider = true,
  labelledBy,
  tone = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-24 py-20 sm:py-24 lg:py-28",
        divider && "border-t",
        tone === "raised" && "bg-surface/40",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

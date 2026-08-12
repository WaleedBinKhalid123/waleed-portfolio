import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  /** Rendered as the `id` of the heading, so sections can reference it. */
  id: string;
  /** Two-digit editorial index, e.g. "02". */
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  /** `h3` is used where a heading already sits inside a labelled region. */
  as?: "h2" | "h3";
}

/**
 * Editorial section header: an index and label on a full-width rule, with the
 * title beneath it.
 *
 * The rule spans the column rather than the text, which is what makes each
 * section read as a chapter opening instead of another stacked block — and it
 * draws itself across as the heading arrives, so the eye is led left to right
 * into the title.
 */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("w-full", className)} distance={12}>
      <div className="flex items-center gap-4">
        {index ? <span className="font-mono text-xs text-accent">{index}</span> : null}
        <span aria-hidden="true" className="rule-draw h-px flex-1 bg-border" />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <Heading
        id={id}
        className="mt-6 max-w-3xl font-display text-[1.875rem] leading-[1.15] font-medium tracking-[-0.032em] sm:text-[2.25rem] lg:text-[2.5rem]"
      >
        {title}
      </Heading>

      {description ? (
        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

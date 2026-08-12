import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { techIconKey, techIcons } from "@/components/ui/techIcons";

interface TagListProps {
  items: string[];
  /** Tags shown before the overflow counter takes over. */
  max?: number;
  variant?: "solid" | "outline";
  className?: string;
  /** Names the list for assistive technology, e.g. "Technologies used". */
  label?: string;
  /**
   * Show brand marks beside recognised technologies. Reserved for the places
   * with room to carry them — featured project cards — since a mark on every
   * tag across the page turns a restrained list into a sticker sheet.
   */
  withIcons?: boolean;
}

/**
 * Renders a capped row of tags. Anything past `max` collapses into a single
 * "+N" marker so a long stack never turns into a wall of chips — but the
 * overflowing names stay in the DOM for screen readers and crawlers rather
 * than being dropped.
 */
export function TagList({
  items,
  max = 8,
  variant = "outline",
  className,
  label,
  withIcons = false,
}: TagListProps) {
  if (items.length === 0) return null;

  const visible = items.slice(0, max);
  const overflow = items.slice(max);

  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((item) => {
        // Direct lookup in a module-level map: one stable identity per key,
        // and `undefined` for anything without a genuine mark.
        const Icon = withIcons ? techIcons[techIconKey(item)] : undefined;

        return (
          <li key={item}>
            <Badge variant={variant} className={cn(Icon && "gap-1.5")}>
              {Icon ? <Icon aria-hidden="true" className="size-3 shrink-0 opacity-70" /> : null}
              {item}
            </Badge>
          </li>
        );
      })}

      {overflow.length > 0 ? (
        <>
          {overflow.map((item) => (
            <li key={item} className="sr-only">
              {item}
            </li>
          ))}
          <li aria-hidden="true">
            <Badge variant={variant} className="text-subtle">
              +{overflow.length}
            </Badge>
          </li>
        </>
      ) : null}
    </ul>
  );
}

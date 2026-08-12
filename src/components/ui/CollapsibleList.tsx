"use client";

import { cn } from "@/lib/utils";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Children, useRef, useState, type ReactNode } from "react";

interface CollapsibleListProps {
  children: ReactNode;
  /** How many items stay visible while collapsed. Supported range: 1–8. */
  visibleCount: number;
  /** Singular noun for the button label, e.g. "role" → "Show 3 more roles". */
  itemNoun: string;
  /** Element to render; `ol`/`ul` keep list semantics intact. */
  as?: "ol" | "ul" | "div";
  className?: string;
  toggleClassName?: string;
}

/**
 * Caps a long list at a sensible length with a Show more / Show less control.
 *
 * Every item is rendered into the HTML — the overflow is hidden with CSS keyed
 * off `data-expanded`, so search engines and assistive technology still see the
 * full list, nothing re-renders on toggle, and the markup stays a valid list.
 * The rule is gated on `html.js` (set before first paint), so without
 * JavaScript the list simply renders in full rather than becoming unreachable.
 */
export function CollapsibleList({
  children,
  visibleCount,
  itemNoun,
  as: Tag = "ul",
  className,
  toggleClassName,
}: CollapsibleListProps) {
  const items = Children.toArray(children);
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLElement>(null);

  const hiddenCount = items.length - visibleCount;

  // Nothing to collapse — render the plain list and no control.
  if (hiddenCount <= 0) {
    return <Tag className={className}>{children}</Tag>;
  }

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);

    // Collapsing from far down the list would otherwise leave the viewport
    // somewhere below the section entirely.
    if (!next && listRef.current) {
      const { top } = listRef.current.getBoundingClientRect();
      if (top < 0) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        listRef.current.scrollIntoView({
          block: "start",
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    }
  };

  const listId = `collapsible-${itemNoun}-list`;

  return (
    <>
      <Tag
        id={listId}
        ref={listRef as React.Ref<HTMLOListElement & HTMLUListElement & HTMLDivElement>}
        data-collapsible=""
        data-visible-count={visibleCount}
        data-expanded={expanded}
        className={className}
      >
        {children}
      </Tag>

      <div className={cn("flex", toggleClassName)}>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={listId}
          className={cn(
            "group inline-flex items-center gap-2 rounded-md py-2 text-sm text-muted",
            "transition-colors duration-200 hover:text-foreground",
          )}
        >
          {expanded ? (
            <>
              Show less
              <FiChevronUp aria-hidden="true" className="size-4 text-subtle" />
            </>
          ) : (
            <>
              Show {hiddenCount} more {hiddenCount === 1 ? itemNoun : `${itemNoun}s`}
              <FiChevronDown aria-hidden="true" className="size-4 text-subtle" />
            </>
          )}
        </button>
      </div>
    </>
  );
}

"use client";

import { cn } from "@/lib/utils";
import type { Certification } from "@/types/portfolio";
import { useMemo, useState, type ReactNode } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface CertificationGalleryProps {
  certifications: Certification[];
  /** One pre-rendered card per certification, keyed by id. */
  cards: Record<string, ReactNode>;
  /** Rows shown before "Show all" appears, in cards. */
  visibleCount: number;
}

const ALL = "All";

/**
 * Filter + progressive disclosure for a large credential set.
 *
 * Two decisions worth stating:
 *
 * 1. Every card is rendered on the server and passed in as `cards`. This
 *    component only decides which are *shown*, so the full list is always in
 *    the HTML for crawlers, the card markup stays a Server Component, and
 *    filtering costs no re-render of card internals.
 * 2. Categories are derived from the data, not hardcoded. Add a certification
 *    in a new category and its tab appears, with a correct count.
 */
export function CertificationGallery({
  certifications,
  cards,
  visibleCount,
}: CertificationGalleryProps) {
  const [category, setCategory] = useState<string>(ALL);
  const [expanded, setExpanded] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const certification of certifications) {
      if (!certification.category) continue;
      counts.set(certification.category, (counts.get(certification.category) ?? 0) + 1);
    }

    return [
      { name: ALL, count: certifications.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [certifications]);

  const matching = useMemo(
    () =>
      category === ALL
        ? certifications
        : certifications.filter((certification) => certification.category === category),
    [certifications, category],
  );

  const visible = expanded ? matching : matching.slice(0, visibleCount);
  const visibleIds = useMemo(() => new Set(visible.map((item) => item.id)), [visible]);
  const hiddenCount = matching.length - visible.length;

  const selectCategory = (next: string) => {
    setCategory(next);
    // A fresh filter starts collapsed again, so the section never jumps to
    // full height just because the previous filter had been expanded.
    setExpanded(false);
  };

  return (
    <div>
      {categories.length > 1 ? (
        <div
          role="tablist"
          aria-label="Filter certifications by category"
          className="-mx-1 flex flex-wrap gap-1.5 px-1"
        >
          {categories.map((entry) => {
            const isActive = entry.name === category;

            return (
              <button
                key={entry.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectCategory(entry.name)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200",
                  isActive
                    ? "border-accent/40 bg-accent-soft text-foreground"
                    : "text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {entry.name}
                <span
                  className={cn(
                    "font-mono text-[0.6875rem]",
                    isActive ? "text-accent" : "text-subtle",
                  )}
                >
                  {entry.count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Announces the result of a filter change to screen reader users. */}
      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {certifications.length} certifications
        {category === ALL ? "" : ` in ${category}`}.
      </p>

      {/*
        Keyed on the filter so React remounts the list when it changes. That
        replays each card's reveal, which is what turns a filter change from a
        snap into a staggered entrance — no extra animation code, and the cards
        themselves stay server-rendered.
      */}
      <ul key={category} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <li
            key={certification.id}
            className={cn(!visibleIds.has(certification.id) && "hidden")}
          >
            {cards[certification.id]}
          </li>
        ))}
      </ul>

      {matching.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No certifications in this category yet.</p>
      ) : null}

      {hiddenCount > 0 || expanded ? (
        <div className="mt-8 flex justify-center border-t pt-6">
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 rounded-md py-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
          >
            {expanded ? (
              <>
                Show fewer
                <FiChevronUp aria-hidden="true" className="size-4 text-subtle" />
              </>
            ) : (
              <>
                Show all {matching.length} certifications
                <FiChevronDown aria-hidden="true" className="size-4 text-subtle" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

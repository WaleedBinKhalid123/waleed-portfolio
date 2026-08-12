"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import type { BrandIconKey } from "@/types/portfolio";
import { brandIcons } from "@/components/ui/brandIcons";

interface CredentialMarkProps {
  /** Image logo. Wins when present and loadable. */
  src?: string;
  /** Brand icon key, e.g. "aws". Used when there is no image. */
  icon?: BrandIconKey;
  /** Organisation name; also the source of the initials fallback. */
  name: string;
  size?: number;
  className?: string;
}

/**
 * The mark shown beside a credential, degree or role, in three tiers:
 *
 *   1. a logo image, when one is supplied and loads;
 *   2. a brand icon (AWS, Google Cloud, Docker…) matched by key;
 *   3. the organisation's initials.
 *
 * Every tier is a deliberate design, so a missing asset never reads as a gap —
 * and a broken image silently falls through to the next tier rather than
 * leaving a torn-image icon on the page.
 */
export function CredentialMark({ src, icon, name, size = 40, className }: CredentialMarkProps) {
  const [failed, setFailed] = useState(false);
  // Direct lookup in a module-level map: one stable component identity per key.
  const BrandIcon = icon ? brandIcons[icon] : null;
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-elevated",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={`${name} logo`}
          width={size}
          height={size}
          draggable={false}
          className="size-full object-contain p-1.5 select-none"
          onError={() => setFailed(true)}
        />
      ) : BrandIcon ? (
        <BrandIcon aria-hidden="true" className="size-[45%] text-foreground/70" />
      ) : (
        <span
          aria-hidden="true"
          className="font-mono text-[0.7rem] font-medium tracking-wide text-subtle"
        >
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  /** Optional by design — the layout must read as complete without it. */
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * A portrait, or nothing at all.
 *
 * Unlike an organisation logo — where initials are a sensible stand-in — an
 * absent photo has no meaningful placeholder, so this renders nothing when
 * `src` is missing or the file fails to load. No broken icon, no empty ring,
 * no reserved gap.
 */
export function ProfileImage({ src, alt, size = 56, className, priority }: ProfileImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      onError={() => setFailed(true)}
      // Portraits shouldn't be draggable — dragging one out of the page is
      // never intentional, and the ghost image just looks like a glitch.
      draggable={false}
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-full border object-cover select-none", className)}
    />
  );
}

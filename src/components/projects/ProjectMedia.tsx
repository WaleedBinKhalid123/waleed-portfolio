"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import type { SyntheticEvent } from "react";

interface ProjectMediaProps {
  src?: string;
  /** Additional screenshots — 2+ renders a scrollable gallery instead. */
  images?: string[];
  title: string;
  /** Shown in the fallback treatment instead of an empty frame. */
  technologies: string[];
  /** Two-digit index used as a typographic marker in the fallback. */
  index: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Featured media is taller and carries the wordmark at a larger size. */
  variant?: "featured" | "compact";
}

/**
 * A screenshot when one exists, and a deliberate typographic panel when it does
 * not — covering the missing-image and failed-load cases without ever showing a
 * broken frame.
 *
 * Hover belongs to the parent card (`group`), so the whole card reacts as one
 * surface rather than the image behaving like a separate control.
 */
export function ProjectMedia({
  src,
  images,
  title,
  technologies,
  index,
  className,
  sizes,
  priority,
  variant = "compact",
}: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);
  const gallery = images && images.length > 1 ? images : null;
  const showImage = Boolean(src) && !failed && !gallery;
  const isFeatured = variant === "featured";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-elevated",
        isFeatured ? "aspect-16/10 lg:aspect-4/3" : "aspect-16/10",
        className,
      )}
    >
      {gallery ? (
        <ProjectGallery images={gallery} title={title} sizes={sizes} priority={priority} />
      ) : showImage ? (
        <>
          <Image
            src={src as string}
            alt={`${title} — project screenshot`}
            fill
            sizes={sizes}
            priority={priority}
            draggable={false}
            className="object-cover transition-transform duration-700 ease-out select-none group-hover:scale-[1.04]"
            onError={() => setFailed(true)}
          />
          {/* Barely-there scrim so the card border stays legible over any image. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "flex h-full flex-col justify-between",
            isFeatured ? "p-6 sm:p-8" : "p-5 sm:p-6",
          )}
        >
          <span className="font-mono text-xs text-subtle">{index}</span>

          <span
            className={cn(
              "leading-snug font-medium tracking-tight text-balance text-foreground/80 transition-colors duration-300 group-hover:text-foreground",
              isFeatured ? "text-xl sm:text-2xl" : "text-lg",
            )}
          >
            {title}
          </span>

          <span className="truncate font-mono text-[0.6875rem] tracking-tight text-subtle">
            {technologies.slice(0, 4).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}

interface ProjectGalleryProps {
  images: string[];
  title: string;
  sizes: string;
  priority?: boolean;
}

/**
 * A horizontally snapping scroller — one real screenshot per slide, no
 * cropping into a collage. Dots reflect and drive the current slide; the
 * scroll itself is native (touch/trackpad/keyboard), never JS-animated.
 */
function ProjectGallery({ images, title, sizes, priority }: ProjectGalleryProps) {
  const [active, setActive] = useState(0);
  // Wide screenshots should fill the frame edge to edge; a portrait or
  // near-square image (a diagram, a phone screen) would lose its top and
  // bottom to that same crop, so it gets shown in full instead. Measured per
  // image once it loads, rather than fixed per project.
  const [fitModes, setFitModes] = useState<Record<number, "cover" | "contain">>({});
  const trackRef = useRef<HTMLDivElement>(null);

  function handleImageLoad(i: number, e: SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    const mode = naturalWidth / naturalHeight >= 1.4 ? "cover" : "contain";
    setFitModes((prev) => (prev[i] === mode ? prev : { ...prev, [i]: mode }));
  }

  function scrollToIndex(i: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <div className="group/gallery relative h-full w-full">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-start">
            <Image
              src={src}
              alt={`${title} — screenshot ${i + 1} of ${images.length}`}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              draggable={false}
              onLoad={(e) => handleImageLoad(i, e)}
              className={cn(
                "select-none",
                (fitModes[i] ?? "cover") === "cover" ? "object-cover" : "object-contain",
              )}
            />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover/gallery:opacity-100"
      />

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show screenshot ${i + 1} of ${images.length}`}
            aria-current={i === active}
            onClick={() => scrollToIndex(i)}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === active ? "bg-white" : "bg-white/50 hover:bg-white/75",
            )}
          />
        ))}
      </div>
    </div>
  );
}

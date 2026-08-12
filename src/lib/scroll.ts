/**
 * In-page navigation.
 *
 * Native anchor jumps compute the destination once, at click time. On a page
 * like this one — lazy images, web fonts, revealed sections — the intervening
 * content can change height while a smooth scroll is still travelling, and the
 * scroll finishes somewhere short of (or past) the section that was clicked.
 *
 * So: scroll deliberately, then verify. Once the scroll settles we re-measure
 * the target and correct it if it drifted. Reduced-motion users jump straight
 * there, where no drift is possible.
 */

/** Sticky header height plus a little breathing room above the heading. */
const HEADER_OFFSET = 76;

/** Anything under this many pixels of drift is imperceptible; leave it alone. */
const DRIFT_TOLERANCE = 4;

function targetScrollTop(element: Element): number {
  return Math.max(element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, 0);
}

interface ScrollOptions {
  /**
   * Jump rather than glide. Used when arriving from another route: there is no
   * journey to show, and a navigation can still be settling — framework scroll
   * restoration lands after ours — so the position is re-asserted twice more
   * rather than animated once and hoped for.
   */
  instant?: boolean;
}

export function scrollToElement(element: Element, options: ScrollOptions = {}): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const jump = options.instant || prefersReducedMotion;

  // `instant`, not `auto`: `auto` defers to CSS `scroll-behavior`, which is
  // `smooth` here — so `auto` would animate exactly where we don't want it to.
  window.scrollTo({ top: targetScrollTop(element), behavior: jump ? "instant" : "smooth" });

  if (jump) {
    // Re-assert after the next frames, so anything that scrolls late loses.
    for (const delay of [80, 350]) {
      window.setTimeout(() => {
        const drift = element.getBoundingClientRect().top - HEADER_OFFSET;
        if (Math.abs(drift) > DRIFT_TOLERANCE) {
          window.scrollTo({ top: targetScrollTop(element), behavior: "instant" });
        }
      }, delay);
    }
    return;
  }

  // Keyboard users must continue from the section they asked for, not from the
  // link they left behind. `scroll-mt` on the section keeps the heading clear.
  const focusTarget = element as HTMLElement;
  const hadTabIndex = focusTarget.hasAttribute("tabindex");
  if (!hadTabIndex) focusTarget.setAttribute("tabindex", "-1");
  focusTarget.focus({ preventScroll: true });
  if (!hadTabIndex) focusTarget.removeAttribute("tabindex");

  if (prefersReducedMotion) return;

  let timer = 0;

  const settle = () => {
    window.clearTimeout(timer);
    window.removeEventListener("scrollend", settle);

    const drift = element.getBoundingClientRect().top - HEADER_OFFSET;
    if (Math.abs(drift) > DRIFT_TOLERANCE) {
      // A snap, never a second animation — the reader has already arrived.
      window.scrollTo({ top: targetScrollTop(element), behavior: "instant" });
    }
  };

  // Hoisted to a boolean: an `in` check inline would narrow `window` itself.
  const supportsScrollEnd = "onscrollend" in window;

  if (supportsScrollEnd) {
    window.addEventListener("scrollend", settle, { once: true });
    // Safety net: `scrollend` never fires when the page was already in place.
    timer = window.setTimeout(settle, 1500);
  } else {
    // Without `scrollend`, wait out a typical smooth scroll, then correct.
    timer = window.setTimeout(settle, 800);
  }
}

/**
 * The element id behind a section href.
 *
 * Links are written as `/#about` rather than `#about` so they still work from
 * another route — a bare fragment on `/resume.pdf` just appends the hash and
 * leaves you where you were. Both forms resolve here.
 */
export function sectionId(href: string): string {
  return href.replace(/^\/?#/, "");
}

/** Resolves a section href to an element, tolerating malformed selectors. */
export function findAnchorTarget(href: string): Element | null {
  if (!href.includes("#")) return null;

  const id = sectionId(href);
  if (!id) return null;

  try {
    return document.getElementById(decodeURIComponent(id));
  } catch {
    return null;
  }
}

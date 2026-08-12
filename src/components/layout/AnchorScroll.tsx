"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { findAnchorTarget, scrollToElement } from "@/lib/scroll";

/**
 * Routes every in-page anchor through one measured, self-correcting scroll.
 *
 * One delegated listener on the document covers the header, the mobile menu,
 * the footer and the hero buttons — no component has to opt in, and none of
 * them carry their own scroll logic. Modified clicks (new tab, download) and
 * links marked `data-native-anchor` fall through to the browser untouched.
 */
export function AnchorScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      // Let the browser handle open-in-new-tab, downloads and middle clicks.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.dataset.nativeAnchor !== undefined) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // `#about` always, `/#about` only while we are on the home page — from
      // anywhere else it must be left alone so the browser actually navigates.
      const isBareHash = href.startsWith("#");
      const isHomeHash = href.startsWith("/#") && window.location.pathname === "/";
      if (!isBareHash && !isHomeHash) return;

      const target = findAnchorTarget(href);
      if (!target) return;

      event.preventDefault();
      scrollToElement(target);

      // Keep the URL shareable without letting the browser jump as well.
      const hash = `#${target.id}`;
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    };

    // Capture phase, so this runs before next/link's own handler and the
    // preventDefault below stops it from navigating as well.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  /*
   * Landing on `/#projects` should arrive in the right place — whether that is
   * a cold load, a back/forward step, or a client-side navigation from another
   * route (the 404 page links here that way).
   *
   * `pathname` is in the dependencies deliberately: this component lives in the
   * layout and stays mounted across route changes, so a mount-only effect would
   * fire on the 404 page and never again.
   */
  const pathname = usePathname();

  useEffect(() => {
    const target = findAnchorTarget(window.location.hash);
    if (!target) return;

    // A frame or two for the incoming route to lay out before measuring.
    // `instant`: arriving at a deep link is not a journey, and the jump then
    // re-asserts itself so late scroll restoration cannot undo it.
    const timer = window.setTimeout(() => scrollToElement(target, { instant: true }), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Back/forward between hashes on the same page.
  useEffect(() => {
    const onHashChange = () => {
      const target = findAnchorTarget(window.location.hash);
      if (target) scrollToElement(target);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}

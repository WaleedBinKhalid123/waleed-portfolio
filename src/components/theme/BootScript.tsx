import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Runs before the first paint and does two things the rest of the app depends
 * on being true from the very first frame:
 *
 *  1. Applies the stored (or system) theme — anything that waited for React
 *     would show a frame of the wrong colours. Dark is the default.
 *  2. Marks the document as JavaScript-capable, so progressive-enhancement CSS
 *     (collapsible lists) only takes effect where the controls actually work.
 *
 * It has to be a blocking inline script in `<head>`; there is no async
 * alternative that avoids the flash.
 *
 * The storage key comes from `@/lib/theme` — a plain module, not the client
 * component that consumes it — because a Server Component importing from a
 * `"use client"` module receives a reference proxy, which would serialise here
 * as `undefined`.
 */
const script = `(function(){var r=document.documentElement;r.classList.add("js");try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){r.classList.add("dark");}})();`;

export function BootScript() {
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}

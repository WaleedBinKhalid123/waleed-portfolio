/**
 * A single IntersectionObserver shared by every reveal on the page.
 *
 * V1 created one observer per revealed element. That is fine for a dozen
 * blocks and wasteful at V2's scale, where twenty-plus certification tiles,
 * five timeline entries and every project card want the same treatment: one
 * observer with many targets is measurably cheaper than many observers, and
 * the browser batches the callbacks.
 *
 * The observer flips a `data-visible` attribute and unobserves — the animation
 * itself is CSS (see `.reveal` in globals.css), so nothing re-renders.
 */

type RevealTarget = Element;

let observer: IntersectionObserver | null = null;

/** Optional side effects to run the first time a target appears. */
const callbacks = new WeakMap<RevealTarget, () => void>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-visible", "true");
        observer?.unobserve(entry.target);

        const callback = callbacks.get(entry.target);
        if (callback) {
          callbacks.delete(entry.target);
          callback();
        }
      }
    },
    // Fire a little before the element is fully in view: content should be
    // settled by the time the reader's eye arrives, never mid-fade.
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
  );

  return observer;
}

/**
 * Starts watching an element, optionally running `onReveal` the first time it
 * appears (used by the animated counters). Returns a cleanup function.
 *
 * Falls back to revealing immediately where IntersectionObserver is missing,
 * so content is never left hidden.
 */
export function observeReveal(target: RevealTarget, onReveal?: () => void): () => void {
  const instance = getObserver();

  if (!instance) {
    target.setAttribute("data-visible", "true");
    onReveal?.();
    return () => {};
  }

  if (onReveal) callbacks.set(target, onReveal);
  instance.observe(target);

  return () => {
    callbacks.delete(target);
    instance.unobserve(target);
  };
}

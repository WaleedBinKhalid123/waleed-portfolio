/**
 * Joins conditional class names. Deliberately tiny — the project has no need
 * for a class-merging dependency, since variants are defined in one place per
 * component rather than overridden from the outside.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Initials used as a logo fallback: "Acme Digital" → "AD", "Northwind" → "NO".
 * Always returns something renderable so the fallback never collapses.
 */
export function getInitials(name: string, maxLength = 2): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "—";

  if (words.length === 1) {
    return words[0].slice(0, maxLength).toUpperCase();
  }

  return words
    .slice(0, maxLength)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** True for `http(s)` URLs, which need `target="_blank"` and remote-image care. */
export function isExternalUrl(url?: string): boolean {
  return Boolean(url && /^https?:\/\//i.test(url));
}

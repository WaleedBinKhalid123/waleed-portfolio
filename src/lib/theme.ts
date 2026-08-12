/**
 * Theme constants shared by the server and the client.
 *
 * These must live in a module with no `"use client"` directive: a Server
 * Component importing a value from a client module receives a client-reference
 * proxy rather than the value itself, so the storage key would arrive as
 * `undefined` in the inline boot script and the stored preference would never
 * be found.
 */

export type Theme = "light" | "dark";

/** localStorage key holding the visitor's explicit choice, if they made one. */
export const THEME_STORAGE_KEY = "theme";

/** Used when nothing is stored and the OS expresses no preference. */
export const DEFAULT_THEME: Theme = "dark";

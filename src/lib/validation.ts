import { z } from "zod";
import type { ContactFormValues } from "@/types/portfolio";

/**
 * Contact form contract.
 *
 * Defined once and used on both sides: the client for immediate feedback, the
 * route handler as the actual gate. Client-side validation is a convenience —
 * the server never trusts it.
 */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 5000 },
} as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "Please enter your name.")
    .max(CONTACT_LIMITS.name.max, `Name must be ${CONTACT_LIMITS.name.max} characters or fewer.`),

  email: z
    .email("Please enter a valid email address.")
    .trim()
    .max(CONTACT_LIMITS.email.max, "That email address is too long."),

  subject: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.subject.min, "Please add a short subject.")
    .max(
      CONTACT_LIMITS.subject.max,
      `Subject must be ${CONTACT_LIMITS.subject.max} characters or fewer.`,
    ),

  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, "Please write at least a couple of sentences.")
    .max(
      CONTACT_LIMITS.message.max,
      `Message must be ${CONTACT_LIMITS.message.max} characters or fewer.`,
    ),

  /**
   * Honeypot: hidden from people, irresistible to naive bots.
   *
   * Deliberately *not* constrained to an empty string — a schema failure here
   * would return a field error naming the trap, telling the bot exactly what
   * to leave alone next time. The route handler inspects it instead and
   * answers with a plain success. The bound only keeps the payload small.
   */
  company: z.string().max(200).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

/**
 * Collapses Zod issues into one message per field — matching how the form
 * renders them. Written against `error.issues`, which is stable across Zod
 * majors, rather than a version-specific flatten helper.
 */
export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;

    const key = field as keyof ContactFormValues;
    if (!errors[key]) errors[key] = issue.message;
  }

  return errors;
}

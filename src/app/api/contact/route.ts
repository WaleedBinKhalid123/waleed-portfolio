import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";
import type { ContactApiResponse } from "@/types/portfolio";
import { contactFormSchema, toFieldErrors } from "@/lib/validation";
import { checkRateLimit, recordDelivery, wasRecentlyDelivered } from "@/lib/rate-limit";

/** Nodemailer opens a TCP connection, so this handler needs the Node runtime. */
export const runtime = "nodejs";

const RATE_LIMIT = { requests: 5, windowMs: 15 * 60 * 1000 } as const;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

const MESSAGES = {
  success: "Message sent successfully. I'll get back to you soon.",
  invalid: "Please check the highlighted fields and try again.",
  rateLimited: "Too many messages from this connection. Please try again later.",
  failure: "Something went wrong. Please try again or email me directly.",
} as const;

function json(body: ContactApiResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

/** Best-effort client identity for rate limiting behind a proxy or CDN. */
function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() ?? "unknown";
}

export async function POST(request: Request): Promise<NextResponse<ContactApiResponse>> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: MESSAGES.invalid }, 400);
  }

  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      { ok: false, message: MESSAGES.invalid, errors: toFieldErrors(parsed.error) },
      400,
    );
  }

  const data = parsed.data;

  // Honeypot: a filled hidden field means a bot. Report success so it does not
  // learn anything, but send nothing.
  if (data.company) {
    return json({ ok: true, message: MESSAGES.success }, 200);
  }

  const clientKey = getClientKey(request);
  const limit = checkRateLimit(clientKey, RATE_LIMIT.requests, RATE_LIMIT.windowMs);

  if (!limit.allowed) {
    return json({ ok: false, message: MESSAGES.rateLimited }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  // A repeated submission (double-click, impatient retry) is acknowledged
  // without sending the same email twice.
  const fingerprint = `${data.email}|${data.subject}|${data.message}`;
  if (wasRecentlyDelivered(fingerprint)) {
    return json({ ok: true, message: MESSAGES.success }, 200);
  }

  const result = await sendContactEmail(data);

  if (!result.ok) {
    // The reason is logged server-side; the client only ever sees this.
    return json({ ok: false, message: MESSAGES.failure }, 500);
  }

  recordDelivery(fingerprint, DUPLICATE_WINDOW_MS);

  return json({ ok: true, message: MESSAGES.success }, 200);
}

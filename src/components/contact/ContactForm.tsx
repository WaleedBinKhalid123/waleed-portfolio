"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useId, useState, type FormEvent } from "react";
import { FiAlertCircle, FiCheck, FiLoader, FiSend } from "react-icons/fi";
import { CONTACT_LIMITS, contactFormSchema, toFieldErrors } from "@/lib/validation";
import type { ContactApiResponse, ContactFormStatus, ContactFormValues } from "@/types/portfolio";

const EMPTY_FORM: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

const FIELD_CLASSES =
  "w-full rounded-md border bg-surface px-3.5 py-2.5 text-[0.9375rem] text-foreground " +
  "placeholder:text-subtle transition-colors duration-200 hover:border-border-strong " +
  "focus:border-accent focus:outline-none";

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const isSubmitting = status === "submitting";

  const update = (field: keyof ContactFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear the error as soon as the visitor starts fixing the field.
    setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    // Same schema the server uses — this only saves a round trip.
    const parsed = contactFormSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setStatus("error");
      setFeedback("Please check the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setStatus("error");
        setFeedback(result.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setFeedback(result.message);
      setValues(EMPTY_FORM);
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again or email me directly.");
    }
  };

  const describedBy = (field: keyof ContactFormValues) =>
    errors[field] ? `${formId}-${field}-error` : undefined;

  const messageLength = values.message.length;
  const showCounter = messageLength > CONTACT_LIMITS.message.max * 0.8;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Name"
          error={errors.name}
          errorId={describedBy("name")}
        >
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            disabled={isSubmitting}
            placeholder="Your name"
            className={cn(FIELD_CLASSES, errors.name && "border-red-500/70")}
          />
        </Field>

        <Field
          id={`${formId}-email`}
          label="Email"
          error={errors.email}
          errorId={describedBy("email")}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            disabled={isSubmitting}
            placeholder="you@company.com"
            className={cn(FIELD_CLASSES, errors.email && "border-red-500/70")}
          />
        </Field>
      </div>

      <Field
        id={`${formId}-subject`}
        label="Subject"
        error={errors.subject}
        errorId={describedBy("subject")}
      >
        <input
          id={`${formId}-subject`}
          name="subject"
          type="text"
          required
          maxLength={CONTACT_LIMITS.subject.max}
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={describedBy("subject")}
          disabled={isSubmitting}
          placeholder="What would you like to discuss?"
          className={cn(FIELD_CLASSES, errors.subject && "border-red-500/70")}
        />
      </Field>

      <Field
        id={`${formId}-message`}
        label="Message"
        error={errors.message}
        errorId={describedBy("message")}
        hint={
          showCounter
            ? `${messageLength.toLocaleString()} / ${CONTACT_LIMITS.message.max.toLocaleString()}`
            : undefined
        }
      >
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message.max}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          disabled={isSubmitting}
          placeholder="A short outline of the project, role or question."
          className={cn(FIELD_CLASSES, "resize-y", errors.message && "border-red-500/70")}
        />
      </Field>

      {/* Honeypot — off-screen rather than hidden, and never announced. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company (leave this empty)</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
        />
      </div>

      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <FiLoader aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <FiSend aria-hidden="true" className="size-4" />
              Send message
            </>
          )}
        </Button>

        <p className="text-xs text-subtle">
          Your details are only used to reply. Nothing is stored.
        </p>
      </div>

      {/*
        Always in the DOM so assistive technology has a live region to watch;
        it only takes on visible styling once there is something to say.
      */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-start gap-2.5 text-sm transition-colors",
          feedback && "rounded-md border px-3.5 py-3",
          feedback && status === "success" && "border-accent/35 bg-accent-soft text-foreground",
          feedback &&
            status === "error" &&
            "border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400",
        )}
      >
        {feedback && status === "success" ? (
          <FiCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
        ) : null}
        {feedback && status === "error" ? (
          <FiAlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        ) : null}
        {feedback}
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  errorId?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, errorId, hint, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {hint ? <span className="font-mono text-xs text-subtle">{hint}</span> : null}
      </div>

      {children}

      {error ? (
        <p id={errorId} className="text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

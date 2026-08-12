import { cn } from "@/lib/utils";
import { FiArrowUpRight } from "react-icons/fi";
import type { Certification } from "@/types/portfolio";
import { formatMonthYear, isPastMonth } from "@/lib/date";
import { CredentialMark } from "@/components/ui/CredentialMark";

interface CertificationCardProps {
  certification: Certification;
  className?: string;
}

/**
 * One credential, compact enough that twenty-five of them still scan.
 *
 * Everything below the name is conditional: no logo falls back to issuer
 * initials, no expiry date renders no expiry line, and "View credential" only
 * appears when there is a real URL to point at.
 */
export function CertificationCard({ certification, className }: CertificationCardProps) {
  const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl, logo, icon, category, featured } =
    certification;

  const issued = formatMonthYear(issueDate);
  const expires = formatMonthYear(expiryDate);
  const expired = isPastMonth(expiryDate);

  return (
    <article
      className={cn(
        "card card-interactive flex h-full flex-col rounded-xl p-5",
        featured && "border-accent/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <CredentialMark src={logo} icon={icon} name={issuer} size={40} />

        {featured ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[0.6875rem] font-medium text-accent">
            <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
            Featured
          </span>
        ) : category ? (
          <span className="eyebrow shrink-0">{category}</span>
        ) : null}
      </div>

      <h3 className="mt-4 text-[0.9375rem] leading-snug font-medium tracking-tight text-balance">
        {name}
      </h3>

      <p className="mt-1.5 text-sm text-muted">{issuer}</p>

      {/* Pushes the metadata to the bottom so cards in a row stay aligned. */}
      <div className="mt-auto pt-4">
        {issued || expires ? (
          <p className="font-mono text-xs text-subtle">
            {issued ? `Issued ${issued}` : null}
            {issued && expires ? (
              <span aria-hidden="true" className="mx-1.5 text-border-strong">
                ·
              </span>
            ) : null}
            {expires ? (
              <span className={cn(expired && "text-muted")}>
                {expired ? "Expired" : "Expires"} {expires}
              </span>
            ) : null}
          </p>
        ) : null}

        {credentialId ? (
          <p className="mt-1.5 font-mono text-xs break-all text-subtle">ID {credentialId}</p>
        ) : null}

        {credentialUrl ? (
          <a
            href={credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 inline-flex items-center gap-1.5 py-1 text-sm text-foreground transition-colors hover:text-accent"
          >
            View credential
            <FiArrowUpRight aria-hidden="true" className="arrow-ne size-3.5" />
            <span className="sr-only"> — {name}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

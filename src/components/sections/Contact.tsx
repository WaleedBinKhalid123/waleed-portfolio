import { siteConfig } from "@/data/site";
import { contactContent } from "@/data/contact";
import { FiArrowUpRight } from "react-icons/fi";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { contactChannelIcons } from "@/components/ui/icons";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading
              id="contact-heading"
              index="07"
              eyebrow="Contact"
              title={contactContent.headline}
              description={contactContent.description}
            />

            <ul className="mt-10 divide-y border-y">
              {contactContent.channels.map((channel) => {
                const Icon = contactChannelIcons[channel.icon];

                const content = (
                  <>
                    <Icon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-subtle transition-colors group-hover:text-accent"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="eyebrow block">{channel.label}</span>
                      <span className="mt-1.5 block text-sm wrap-break-word">{channel.value}</span>
                    </span>
                    {channel.href ? (
                      <FiArrowUpRight
                        aria-hidden="true"
                        className="arrow-ne mt-0.5 size-4 shrink-0 text-subtle transition-colors group-hover:text-accent"
                      />
                    ) : null}
                  </>
                );

                return (
                  <li key={channel.id}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noopener noreferrer" : undefined}
                        className="group flex items-start gap-3.5 py-4 transition-colors hover:text-accent"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="group flex items-start gap-3.5 py-4 text-muted">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Most people would rather paste the address than trust mailto:. */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-subtle">{siteConfig.email}</span>
              <CopyButton value={siteConfig.email} label="Copy email address" />
            </div>

            {contactContent.availability ? (
              <p className="mt-6 flex items-center gap-2.5 text-sm text-subtle">
                <span aria-hidden="true" className="relative flex size-1.5 items-center justify-center">
                  <span className="absolute size-1.5 animate-status-pulse rounded-full bg-accent" />
                  <span className="relative size-1.5 rounded-full bg-accent" />
                </span>
                {contactContent.availability}
              </p>
            ) : null}
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={100}>
            <div className="card rounded-xl p-6 sm:p-8">
              <h3 className="text-base font-medium tracking-tight">Send a message</h3>
              <p className="mt-1.5 text-sm text-muted">
                Straight to my inbox — no newsletter, no follow-up sequence.
              </p>

              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

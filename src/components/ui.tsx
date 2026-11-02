import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Faq, Offer } from "@/content/types";
import { formatPrice, getOfferState, offerLabel } from "@/lib/offer";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: "primary" | "secondary" };

const buttonBase =
  "inline-flex min-h-12 items-center justify-center rounded-control px-6 text-base font-bold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.985]";

export const buttonStyles = {
  primary: `${buttonBase} bg-brand text-bg hover:bg-brand-light`,
  secondary: `${buttonBase} border border-line-strong text-fg hover:border-fg-muted`,
};

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return <Link {...props} className={`${buttonStyles[variant]} ${className}`} />;
}

const dotStyles = {
  concept: "border border-fg-muted",
  upcoming: "bg-brand",
  free: "bg-success",
  paid: "bg-success",
};

export function OfferTag({ offer, className = "" }: { offer: Offer; className?: string }) {
  const price = formatPrice(offer.pricing);
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium text-fg-soft ${className}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${dotStyles[getOfferState(offer)]}`} />
      {offerLabel(offer)}
      {price && price !== "Free" ? <span className="tabular text-fg-muted">{price}</span> : null}
    </span>
  );
}

export function PageIntro({ title, children, aside }: { title: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="shell pb-14 pt-16 sm:pt-24 lg:pb-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="type-hero lg:col-span-8">{title}</h1>
        {children ? <div className="type-lead max-w-xl lg:col-span-4">{children}</div> : null}
      </div>
      {aside}
    </header>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-line">
          <summary className="flex min-h-16 list-none items-center justify-between gap-6 py-4 text-lg font-medium text-fg">
            {item.question}
            <span aria-hidden="true" className="relative size-4 shrink-0">
              <span className="absolute inset-x-0 top-1/2 h-px bg-fg-muted" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-fg-muted transition-transform duration-200 group-open:rotate-90" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-fg-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** Plain title and detail rows, for lists that should read rather than decorate. */
export function DefinitionRows({ items }: { items: { title: string; detail: string }[] }) {
  return (
    <dl className="border-t border-line">
      {items.map((item) => (
        <div key={item.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
          <dt className="font-medium text-fg">{item.title}</dt>
          <dd className="text-fg-soft">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

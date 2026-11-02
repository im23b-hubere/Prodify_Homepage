import type { Metadata } from "next";
import { EchoSquares } from "@/components/echo-squares";
import { DefinitionRows, FaqList } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";
import { membership, membershipFaq } from "@/content/membership";
import { isWaitlistConnected } from "@/lib/waitlist";

export const metadata: Metadata = {
  title: "Membership",
  description: "Every tool. One membership. Prodify Membership is coming soon. Join the waitlist.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  const connected = isWaitlistConnected();
  return (
    <>
      <section className="relative overflow-hidden">
        <EchoSquares className="pointer-events-none absolute -right-20 -top-16 w-[20rem] sm:-right-24 sm:-top-24 sm:w-[30rem] lg:-right-64 lg:-top-40 lg:w-[56rem]" />
        <div className="shell relative pb-20 pt-64 sm:pt-96 lg:pb-28 lg:pt-28">
          <h1 className="type-hero max-w-[50rem]">Every tool. One membership.</h1>
          <div className="mt-10 max-w-md">
            <p className="font-medium text-fg">{membership.status}</p>
            <p className="mt-2 font-display text-6xl font-bold tracking-[-0.03em] text-fg">{membership.plannedPrice}</p>
            <p className="mt-1 text-fg-soft">
              {membership.plannedInterval}. {membership.priceNote}
            </p>
            <div className="mt-8">
              <WaitlistForm interest="membership" connected={connected} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="included-title" className="shell grid gap-10 border-t border-line py-20 lg:grid-cols-12">
        <h2 id="included-title" className="type-title lg:col-span-4">
          What we plan to include
        </h2>
        <div className="lg:col-span-8">
          <DefinitionRows items={membership.benefits} />
        </div>
      </section>

      <section aria-labelledby="faq-title" className="shell grid gap-10 border-t border-line py-20 lg:grid-cols-12">
        <h2 id="faq-title" className="type-title lg:col-span-4">
          Questions
        </h2>
        <div className="lg:col-span-8">
          <FaqList items={membershipFaq} />
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { EchoSquares } from "@/components/echo-squares";
import { WaitlistForm } from "@/components/waitlist-form";
import { membership } from "@/content/membership";
import { isWaitlistConnected } from "@/lib/waitlist";

export function MembershipTeaser() {
  return (
    <section aria-labelledby="membership-title" className="relative overflow-hidden border-y border-line bg-surface">
      <EchoSquares className="pointer-events-none absolute -bottom-44 -right-32 w-[26rem] sm:-bottom-72 sm:w-[40rem] lg:-right-52 lg:bottom-auto lg:top-1/2 lg:w-[54rem] lg:-translate-y-1/2" />
      <div className="shell relative pb-64 pt-20 sm:pb-80 lg:pb-28 lg:pt-28">
        <h2 id="membership-title" className="type-display max-w-[46rem]">
          Every tool. One membership.
        </h2>
        <div className="mt-12 grid max-w-[46rem] gap-10 sm:grid-cols-2 sm:gap-8">
          <ul className="self-start border-t border-line-strong">
            {membership.benefits.map((benefit) => (
              <li key={benefit.title} className="border-b border-line-strong py-3 text-fg">
                {benefit.title}
              </li>
            ))}
          </ul>
          <div>
            <p className="font-medium text-fg">{membership.status}</p>
            <p className="mt-2 font-display text-5xl font-bold tracking-[-0.03em] text-fg">{membership.plannedPrice}</p>
            <p className="mt-1 text-sm text-fg-soft">
              {membership.plannedInterval}. {membership.priceNote}
            </p>
            <div className="mt-6">
              <WaitlistForm interest="membership" connected={isWaitlistConnected()} stacked />
            </div>
            <Link href="/membership" className="text-link mt-4 inline-block font-medium">
              How the membership will work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

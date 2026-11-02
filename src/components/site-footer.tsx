import Link from "next/link";
import { legalNav, site } from "@/content/site";
import { isWaitlistConnected } from "@/lib/waitlist";
import { Mark } from "./brand";
import { WaitlistForm } from "./waitlist-form";

const productLinks = [
  { href: "/plugins", label: "Plugins" },
  { href: "/sounds", label: "Sounds" },
  { href: "/membership", label: "Membership" },
  { href: "/app", label: "App" },
];

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="shell grid gap-12 pb-16 pt-16 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-5">
          <h2 className="type-title max-w-md">Hear about new plugins and sounds first.</h2>
          <div className="mt-6 max-w-md">
            <WaitlistForm interest="general" connected={isWaitlistConnected()} label="Sign up" />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          <div>
            <h3 className="font-sans text-sm font-medium text-fg-muted">Products</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-fg transition-colors duration-150 hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-sm font-medium text-fg-muted">Help</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/support" className="text-fg transition-colors duration-150 hover:text-brand">
                  Support
                </Link>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-fg transition-colors duration-150 hover:text-brand">
                  Contact
                </a>
              </li>
              {site.social.map((link) => (
                <li key={link.href}>
                  <a href={link.href} rel="noopener noreferrer" className="text-fg transition-colors duration-150 hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-sm font-medium text-fg-muted">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-fg transition-colors duration-150 hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="shell flex items-center justify-between gap-4 pb-6 text-sm text-fg-muted">
        <span className="inline-flex items-center gap-2">
          <Mark className="h-3.5 w-auto" />© {new Date().getFullYear()} {site.operator}, {site.location}
        </span>
        <span className="hidden sm:inline">Made for producers.</span>
      </div>

      <div aria-hidden="true" className="select-none overflow-hidden">
        <p className="-mb-[0.235em] text-center font-display text-[24.4vw] font-bold leading-[0.8] tracking-[-0.045em] text-brand">
          Prodify
        </p>
      </div>
    </footer>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/content/site";
import { Logo } from "./brand";
import { ButtonLink } from "./ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 border-b bg-bg transition-colors duration-200 ${raised || open ? "border-line" : "border-transparent"}`}>
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Prodify home" onClick={() => setOpen(false)} className="-m-1 p-1">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {primaryNav.map((item) => {
            const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`py-2 text-[0.9375rem] font-medium transition-colors duration-150 hover:text-fg ${current ? "text-fg" : "text-fg-muted"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden md:block">
            <ButtonLink href="/plugins" className="!min-h-10 !px-4 !text-sm">
              Explore Plugins
            </ButtonLink>
          </span>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="-mr-2 grid size-11 place-items-center text-fg md:hidden"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] flex flex-col justify-between overflow-y-auto overscroll-contain bg-bg px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 md:hidden"
          >
            <ul>
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-4 font-display text-4xl font-bold tracking-[-0.03em] text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-b border-line">
                <Link href="/support" onClick={() => setOpen(false)} className="block py-4 font-display text-4xl font-bold tracking-[-0.03em] text-fg-muted">
                  Support
                </Link>
              </li>
            </ul>
            <ButtonLink href="/plugins" onClick={() => setOpen(false)} className="mt-8 w-full">
              Explore Plugins
            </ButtonLink>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

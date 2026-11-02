"use client";

import { buttonStyles } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell py-28 sm:py-40">
      <h1 className="type-display max-w-3xl">This page failed to load.</h1>
      <p className="type-lead mt-6 max-w-md">Try again. If it keeps failing, email prodify@gmx.net.</p>
      <button type="button" onClick={reset} className={`${buttonStyles.primary} mt-8`}>
        Try again
      </button>
    </div>
  );
}

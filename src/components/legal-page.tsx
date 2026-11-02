import type { ReactNode } from "react";

export function LegalPage({ title, updated, reviewNote, children }: { title: string; updated: string; reviewNote: string; children: ReactNode }) {
  return (
    <article className="shell pb-24 pt-14 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="type-display">{title}</h1>
        <p className="mt-4 text-sm text-fg-muted">Last updated: {updated}</p>
        <div role="note" className="mt-8 rounded-control border border-brand px-4 py-3 text-sm text-fg">
          <strong>Needs review.</strong> {reviewNote}
        </div>
        <div className="mt-10 space-y-8 [&_a]:text-fg [&_a]:underline [&_h2]:mb-2 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-medium">{children}</div>
      </div>
    </article>
  );
}

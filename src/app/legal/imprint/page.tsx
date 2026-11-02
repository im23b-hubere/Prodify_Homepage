import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Imprint", alternates: { canonical: "/legal/imprint" } };

export default function ImprintPage() {
  return (
    <LegalPage
      title="Imprint"
      updated="November 2026"
      reviewNote="Details are taken from the Prodify app's published imprint. A full postal address and any business registration details must be added and checked before launch."
    >
      <section>
        <h2>Service provider</h2>
        <p>{site.operator}, sole proprietor</p>
      </section>
      <section>
        <h2>Address</h2>
        <p>{site.location}</p>
        <p className="mt-1 text-fg-muted">[Street address to be added]</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </section>
      <section>
        <h2>Responsible for content</h2>
        <p>{site.operator}</p>
      </section>
    </LegalPage>
  );
}

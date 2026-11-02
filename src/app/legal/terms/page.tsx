import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/legal/terms" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="November 2026"
      reviewNote="This is a placeholder for website terms. Terms of sale, refunds, governing law and liability must be written with legal advice before anything is sold here."
    >
      <section>
        <h2>This website</h2>
        <p>This website presents Prodify products. Nothing can be bought here yet.</p>
      </section>
      <section>
        <h2>Products in development</h2>
        <p>Plugins, sounds and the membership shown here are in development or concepts. Names, features, prices and release plans can change, and no release is guaranteed.</p>
      </section>
      <section>
        <h2>The Prodify app</h2>
        <p>
          The app has its own terms at <a href="https://klarwerk-tech.ch/prodify/terms">klarwerk-tech.ch/prodify/terms</a>.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </section>
    </LegalPage>
  );
}

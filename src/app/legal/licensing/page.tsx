import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Licensing", alternates: { canonical: "/legal/licensing" } };

export default function LicensingPage() {
  return (
    <LegalPage
      title="Licensing"
      updated="November 2026"
      reviewNote="Plugin and sample licence terms do not exist yet. They need to be drafted and reviewed before the first release."
    >
      <section>
        <h2>Plugins</h2>
        <p>Each plugin will ship with an end user licence. Activation rules and the number of devices will be published before release.</p>
      </section>
      <section>
        <h2>Sounds</h2>
        <p>Terms for using Prodify Sounds in your own music will be published with the first pack.</p>
      </section>
      <section>
        <h2>Website</h2>
        <p>This site uses the Syne and DM Sans typefaces under the SIL Open Font License, and Lucide icons under the ISC License.</p>
      </section>
      <section>
        <h2>Questions</h2>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </section>
    </LegalPage>
  );
}

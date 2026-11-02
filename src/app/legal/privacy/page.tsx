import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/legal/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      reviewNote="This draft describes the website as built today. It must be reviewed, and completed with the hosting provider, the waitlist provider and any analytics, before launch."
    >
      <section>
        <h2>Who is responsible</h2>
        <p>
          {site.operator} ({site.location}) is responsible for personal data processed through this website. Contact: <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>
      <section>
        <h2>Visiting the website</h2>
        <p>The hosting provider processes technical data such as IP addresses to deliver the site and keep it secure. [Hosting provider and retention period to be added.]</p>
      </section>
      <section>
        <h2>Waitlist</h2>
        <p>If you join a waitlist, your email address and the product you are interested in are used to tell you about Prodify releases. [Waitlist provider and legal basis to be added.]</p>
      </section>
      <section>
        <h2>Cookies and analytics</h2>
        <p>This website currently sets no analytics or advertising cookies. This section must be updated if that changes.</p>
      </section>
      <section>
        <h2>The Prodify app</h2>
        <p>
          The mobile app has its own policy at <a href="https://klarwerk-tech.ch/prodify/privacy">klarwerk-tech.ch/prodify/privacy</a>.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          To exercise your privacy rights, email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}

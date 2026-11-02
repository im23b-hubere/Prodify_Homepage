import type { Metadata } from "next";
import { FaqList, PageIntro } from "@/components/ui";
import { site } from "@/content/site";
import { installSteps, supportFaq } from "@/content/support";

export const metadata: Metadata = {
  title: "Support",
  description: "Installation help, common questions and how to contact Prodify support.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <>
      <PageIntro title="Support">
        <p>
          Write to{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . We usually reply within 2 business days.
        </p>
      </PageIntro>

      <section aria-labelledby="install-title" className="shell grid gap-10 border-t border-line py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="install-title" className="type-title">
            Installing a plugin
          </h2>
          <p className="mt-4 max-w-sm text-fg-soft">No plugin is available yet. This is the general process. Full guides arrive with each release.</p>
        </div>
        <ol className="border-t border-line lg:col-span-8">
          {installSteps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-line py-5">
              <span className="tabular text-fg-muted">{index + 1}</span>
              <div>
                <h3 className="font-sans text-lg font-medium">{step.title}</h3>
                <p className="mt-1 text-fg-soft">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {supportFaq.map((group) => (
        <section key={group.group} aria-label={group.group} className="shell grid gap-10 border-t border-line py-20 lg:grid-cols-12">
          <h2 className="type-title lg:col-span-4">{group.group}</h2>
          <div className="lg:col-span-8">
            <FaqList items={group.items} />
          </div>
        </section>
      ))}
    </>
  );
}

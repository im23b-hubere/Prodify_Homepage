import type { Metadata } from "next";
import { PluginCatalogue } from "@/components/plugin-catalogue";
import { PageIntro } from "@/components/ui";
import { plugins } from "@/content/plugins";

export const metadata: Metadata = {
  title: "Plugins",
  description: "Small audio plugins with one clear job: drum enhancement, creative vocals and ear candy.",
  alternates: { canonical: "/plugins" },
};

export default function PluginsPage() {
  return (
    <>
      <PageIntro title="Plugins">
        <p>Small tools for the moments a track needs more: punch, character, movement. None are on sale yet.</p>
      </PageIntro>
      <PluginCatalogue plugins={plugins} />
    </>
  );
}

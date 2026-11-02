import type { PluginSlug } from "@/content/types";
import { CandyInterface } from "./candy";
import { JuiceInterface } from "./juice";
import { VoxInterface } from "./vox";

/** Keeps the slug-to-interface mapping in one place for every template. */
export function PluginInterface({
  slug,
  interactive = true,
  layout = "responsive",
}: {
  slug: PluginSlug;
  interactive?: boolean;
  layout?: "responsive" | "wide";
}) {
  const shared = { interactive, layout };
  if (slug === "juice") return <JuiceInterface {...shared} />;
  if (slug === "vox") return <VoxInterface {...shared} />;
  return <CandyInterface {...shared} />;
}

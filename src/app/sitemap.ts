import type { MetadataRoute } from "next";
import { plugins } from "@/content/plugins";
import { legalNav, site } from "@/content/site";
import { soundPacks } from "@/content/sounds";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/plugins",
    "/sounds",
    "/membership",
    "/app",
    "/support",
    ...plugins.map((plugin) => `/plugins/${plugin.slug}`),
    ...soundPacks.map((pack) => `/sounds/${pack.slug}`),
    ...legalNav.map((link) => link.href),
  ];
  return routes.map((route) => ({ url: `${site.url}${route === "/" ? "" : route}` }));
}

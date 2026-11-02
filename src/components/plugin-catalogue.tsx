"use client";

import Link from "next/link";
import { useState } from "react";
import type { Plugin } from "@/content/types";
import { getOfferState, type OfferState } from "@/lib/offer";
import { PluginInterface } from "./plugins/plugin-interface";
import { OfferTag } from "./ui";

const filters: { id: string; label: string; states: OfferState[] }[] = [
  { id: "all", label: "All", states: ["concept", "upcoming", "free", "paid"] },
  { id: "upcoming", label: "Upcoming", states: ["concept", "upcoming"] },
  { id: "available", label: "Available", states: ["free", "paid"] },
  { id: "free", label: "Free", states: ["free"] },
  { id: "paid", label: "Paid", states: ["paid"] },
];

export function PluginCatalogue({ plugins }: { plugins: Plugin[] }) {
  const [activeId, setActiveId] = useState("all");
  const active = filters.find((filter) => filter.id === activeId) ?? filters[0];
  const visible = plugins.filter((plugin) => active?.states.includes(getOfferState(plugin.offer)));

  return (
    <div className="shell pb-24">
      <div role="group" aria-label="Filter plugins" className="mb-10 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {filters.map((filter) => {
          const count = plugins.filter((plugin) => filter.states.includes(getOfferState(plugin.offer))).length;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={filter.id === activeId}
              onClick={() => setActiveId(filter.id)}
              className={`min-h-11 shrink-0 rounded-control border px-4 text-sm font-medium transition-colors duration-150 ${
                filter.id === activeId ? "border-fg text-fg" : "border-line-strong text-fg-muted hover:text-fg"
              }`}
            >
              {filter.label} <span className="tabular text-fg-muted">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="border-y border-line py-16">
          <p className="type-title">Nothing here yet.</p>
          <p className="mt-3 max-w-md text-fg-soft">No plugins are out yet. Upcoming plugins show their current status on their own pages.</p>
          <button type="button" onClick={() => setActiveId("upcoming")} className="text-link mt-4 font-medium">
            Show upcoming plugins
          </button>
        </div>
      ) : (
        <ul>
          {visible.map((plugin) => (
            <li key={plugin.slug} className="group border-t border-line py-8 lg:py-10">
              <Link href={`/plugins/${plugin.slug}`} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-5">
                  <h2 className="type-name text-[clamp(3.5rem,8vw,7rem)] transition-colors duration-150 group-hover:text-brand">{plugin.name}</h2>
                  <p className="mt-5 font-medium text-fg">{plugin.category}</p>
                  <p className="mt-2 max-w-sm text-fg-soft">{plugin.summary}</p>
                  <OfferTag offer={plugin.offer} className="mt-5" />
                </div>
                <div className="lg:col-span-7">
                  <div className="instrument-case">
                    <PluginInterface slug={plugin.slug} interactive={false} layout="wide" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { markPath } from "@/components/brand";

export const alt = "Prodify: make your sound stand out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const syne = await readFile(join(process.cwd(), "src/assets/Syne_700Bold.ttf"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, fontFamily: "Syne" }}>
      <svg viewBox="100 150 1735 1625" width="86" height="80">
        <path d={markPath} fill="#ff5401" />
      </svg>
      <div style={{ color: "#ffffff", fontSize: 104, lineHeight: 1.02, letterSpacing: -3 }}>Make your sound stand out.</div>
    </div>,
    { ...size, fonts: [{ name: "Syne", data: syne, weight: 700, style: "normal" }] },
  );
}

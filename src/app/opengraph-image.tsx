import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

/**
 * Social card, generated at build time from `site.ts` — the same source as the
 * page metadata, so the two can never disagree.
 */
export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0d0f",
          color: "#ededec",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: "#8ca9ff" }} />
          <div style={{ fontSize: 22, color: "#a1a4aa", letterSpacing: "0.12em" }}>
            {siteConfig.title.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em" }}>
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#a1a4aa",
              maxWidth: 860,
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#74777d" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}

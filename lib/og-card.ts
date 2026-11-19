import { createElement as h, type ReactElement } from "react";
import type * as SiteModule from "./site";

type Site = typeof SiteModule.site;

// The social card drawn into public/og.png by scripts/og.mjs (a static file, not a route handler: AGENTS.md
// allows no API routes). Plain createElement, no JSX, so Node can run it directly with type stripping.
// Text stays ASCII: the built-in ImageResponse font has no Thai glyphs.
export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ogCard(site: Site): ReactElement {
  const colors = site.design.colors;
  const chips: readonly string[] = site.scope;
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: colors.bg,
        color: colors.ink,
      },
    },
    h("div", { style: { display: "flex", fontSize: 26, letterSpacing: 8, color: colors.accent } }, "BOOKCHAOWALIT AGENCY"),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05 } }, site.name),
      h("div", { style: { display: "flex", marginTop: 24, fontSize: 34, color: colors.muted } }, site.design.world),
    ),
    h(
      "div",
      { style: { display: "flex", flexWrap: "wrap", gap: 12 } },
      ...chips.map((chip) =>
        h("div", { key: chip, style: { display: "flex", padding: "10px 18px", borderRadius: 8, border: `2px solid ${colors.accent}`, fontSize: 22 } }, chip),
      ),
    ),
  );
}

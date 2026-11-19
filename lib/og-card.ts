import { createElement as h, type ReactElement } from "react";
import type * as SiteModule from "./site";

type Site = typeof SiteModule.site;

// The social card drawn into public/og.png by scripts/og.mjs (a static file, not a route handler: AGENTS.md
// allows no API routes). Plain createElement, no JSX, so Node can run it directly with type stripping.
// Text stays ASCII: the built-in ImageResponse font has no Thai glyphs.
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Bump when the card's layout changes, so every committed public/og.png must be redrawn. */
export const OG_CARD_VERSION = 1;

/**
 * Everything the committed card depends on: layout version, title, world, scope, colours and the site's domain.
 * scripts/og.mjs stores its hash in lib/og-manifest.json; tests/opengraph.test.tsx fails when it no longer matches.
 */
export function ogFingerprint(site: Site): string {
  const { name, scope, design } = site;
  return JSON.stringify({ v: OG_CARD_VERSION, name, world: design.world, scope, colors: design.colors, url: design.productionUrl });
}

/** WCAG 2 contrast ratio of two #rrggbb colours (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Colour of the "BOOKCHAOWALIT AGENCY" line: the accent when it reaches 3:1 on the card background (the line is
 * 26px, large text), else ink, so a light accent (Science & Deep Tech, 2.12:1) stays readable in link previews.
 */
export function ogLabelColor(colors: { bg: string; ink: string; accent: string }): string {
  return contrastRatio(colors.accent, colors.bg) >= 3 ? colors.accent : colors.ink;
}

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
    h("div", { style: { display: "flex", fontSize: 26, letterSpacing: 8, color: ogLabelColor(colors) } }, "BOOKCHAOWALIT AGENCY"),
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

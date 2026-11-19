import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";

// next/og renders with satori at build time; here we only check what the card is asked to draw.
const calls: { element: ReactElement; options: unknown }[] = [];
vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(element: ReactElement, options: unknown) {
      calls.push({ element, options });
    }
  },
}));

// The layout loads local fonts through a build-time transform; a stub is enough to read its metadata.
vi.mock("next/font/local", () => ({ default: () => ({ variable: "font" }) }));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("social card image", () => {
  it("is a static 1200x630 route at /og.png", async () => {
    const og = await import("@/app/og.png/route");
    expect(og.size).toEqual({ width: 1200, height: 630 });
    expect(og.dynamic).toBe("force-static");
  });

  it("draws the site name, visual world and every scope chip at the declared size", async () => {
    const { GET, size } = await import("@/app/og.png/route");
    GET();
    const { element, options } = calls.at(-1)!;
    expect(options).toEqual(size);
    const markup = renderToStaticMarkup(element);
    for (const text of [site.name, site.design.world, ...site.scope]) expect(markup).toContain(text.replace(/&/g, "&amp;"));
  });

  it("points og:image and twitter:image at an absolute https .png on the site's own domain without NEXT_PUBLIC_SITE_URL", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const { metadata } = await import("@/app/layout");
    const expected = site.design.productionUrl.replace(/\/+$/, "") + "/og.png";
    expect(expected).toMatch(/^https:\/\/[^/]+\/og\.png$/);
    expect(String(metadata.metadataBase)).toBe(site.design.productionUrl.replace(/\/+$/, "") + "/");
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expected, width: 1200, height: 630 })]);
    expect(metadata.twitter?.images).toEqual([expected]);
    expect(JSON.stringify(metadata)).not.toContain("localhost");
  });
});

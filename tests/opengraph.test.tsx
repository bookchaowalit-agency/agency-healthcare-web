import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
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

describe("social card image", () => {
  it("is a 1200x630 PNG with ASCII alt text", async () => {
    const og = await import("@/app/opengraph-image");
    expect(og.size).toEqual({ width: 1200, height: 630 });
    expect(og.contentType).toBe("image/png");
    expect(og.dynamic).toBe("force-static");
    expect(og.alt).toBe(`${site.name} — ${site.design.world}`);
  });

  it("draws the site name, visual world and every scope chip at the declared size", async () => {
    const { default: OpenGraphImage, size } = await import("@/app/opengraph-image");
    OpenGraphImage();
    const { element, options } = calls.at(-1)!;
    expect(options).toEqual(size);
    const markup = renderToStaticMarkup(element);
    for (const text of [site.name, site.design.world, ...site.scope]) expect(markup).toContain(text.replace(/&/g, "&amp;"));
  });
});

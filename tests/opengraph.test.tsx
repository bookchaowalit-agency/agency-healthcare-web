import { renderToStaticMarkup } from "react-dom/server";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";
import { OG_SIZE, ogCard, ogFingerprint } from "@/lib/og-card";

// The layout loads local fonts through a build-time transform; a stub is enough to read its metadata.
vi.mock("next/font/local", () => ({ default: () => ({ variable: "font" }) }));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("social card image", () => {
  it("is a committed 1200x630 PNG in public/, not a route handler (AGENTS.md: no API routes)", () => {
    const png = readFileSync(join(process.cwd(), "public", "og.png"));
    expect(png.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([OG_SIZE.width, OG_SIZE.height]);
    expect(existsSync(join(process.cwd(), "app", "og.png"))).toBe(false);
  });

  it("was drawn from the current site data (title, world, scope, colours, domain): else run node scripts/og.mjs", () => {
    const sha = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
    const manifest = JSON.parse(readFileSync(join(process.cwd(), "lib", "og-manifest.json"), "utf8"));
    expect(manifest.input, "lib/site.ts changed since public/og.png was drawn: run node scripts/og.mjs").toBe(sha(ogFingerprint(site)));
    expect(manifest.png, "public/og.png is not the file scripts/og.mjs wrote").toBe(sha(readFileSync(join(process.cwd(), "public", "og.png"))));
  });

  it("draws the site name, visual world and every scope chip (node scripts/og.mjs writes it)", () => {
    const markup = renderToStaticMarkup(ogCard(site));
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

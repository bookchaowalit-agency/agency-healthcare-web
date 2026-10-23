import { afterEach, describe, expect, it, vi } from "vitest";

async function loadRoutes(env: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  const [{ default: robots }, { default: sitemap }, { pseoService }] = await Promise.all([
    import("@/app/robots"),
    import("@/app/sitemap"),
    import("@/lib/pseo"),
  ]);
  return { robots, sitemap, pseoService };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots and sitemap", () => {
  it("disallow everything and list nothing by default (noindex build)", async () => {
    const { robots, sitemap } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: "", NEXT_PUBLIC_SITE_INDEXABLE: "" });
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(sitemap()).toEqual([]);
  });

  it("stay closed when only the URL is set", async () => {
    const { robots, sitemap } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: "https://example.com", NEXT_PUBLIC_SITE_INDEXABLE: "" });
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(sitemap()).toEqual([]);
  });

  it("open up and list the canonical (trailing-slash) pages only when approved", async () => {
    const { robots, sitemap, pseoService } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: "https://example.com", NEXT_PUBLIC_SITE_INDEXABLE: "true" });
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" }, sitemap: "https://example.com/sitemap.xml" });
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://example.com/",
      "https://example.com/services/",
      `https://example.com/services/${pseoService.slug}/`,
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { pseoService } from "@/lib/pseo";
import { site } from "@/lib/site";
import ServicePage, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/services/[slug]/page";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("pSEO service data", () => {
  it("belongs to this agency site", () => {
    expect(pseoService.kind).toBe("service");
    expect(pseoService.agencySlug).toBe(site.slug);
    expect(pseoService.agencyName).toBe(site.name);
    expect(pseoService.agencyThaiName).toBe(site.thaiName);
    expect(pseoService.agencyStatus).toBe(site.status);
    expect(pseoService.agencyStage).toBe(site.stage);
    expect(pseoService.name).toBe(site.offer);
    expect(pseoService.description).toBe(site.offerDetail);
  });

  it("has a URL-safe slug and filled, unique workflow, deliverables and evidence lists", () => {
    expect(pseoService.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const list of [pseoService.workflow, pseoService.deliverables, pseoService.evidence]) {
      expect(list.length).toBeGreaterThanOrEqual(3);
      expect(new Set(list).size).toBe(list.length);
      for (const item of list) expect(item.trim()).not.toBe("");
    }
    for (const text of [pseoService.title, pseoService.intent, pseoService.buyer, pseoService.context, pseoService.readiness]) {
      expect(text.trim()).not.toBe("");
    }
  });
});

describe("service route", () => {
  it("prerenders exactly the one service slug and nothing else", () => {
    expect(generateStaticParams()).toEqual([{ slug: pseoService.slug }]);
    expect(dynamicParams).toBe(false);
  });

  it("titles the known slug and falls back for an unknown one", async () => {
    const known = await generateMetadata(params(pseoService.slug));
    expect(known.title).toBe(pseoService.title);
    expect(known.description).toBe(pseoService.description);
    const unknown = await generateMetadata(params("no-such-service"));
    expect(unknown.title).toBe("Service");
  });

  it("calls notFound() for an unknown slug", async () => {
    await expect(ServicePage(params("no-such-service"))).rejects.toThrow();
  });
});

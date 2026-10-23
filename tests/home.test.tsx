import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import NotFound from "@/app/not-found";
import ServicesPage from "@/app/services/page";
import Home from "@/app/page";
import ServicePage from "@/app/services/[slug]/page";
import { pseoService } from "@/lib/pseo";
import { site } from "@/lib/site";

// next/font/google only works inside a Next build; the layout just needs the CSS variable names.
vi.mock("next/font/google", () => ({ Noto_Sans_Thai: () => ({ variable: "font-sans" }), Noto_Serif_Thai: () => ({ variable: "font-serif" }) }));

const esc = (text: string) => text.replace(/&/g, "&amp;");

describe("home page", () => {
  it("renders the agency promise, offer, scope and the no-lead-form notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain(esc(site.promise));
    expect(html).toContain(esc(site.offer));
    for (const item of site.scope) expect(html).toContain(esc(item));
    expect(html).toContain("ยังไม่มี lead form หรือการรับข้อมูลลูกค้า");
    expect(html).toContain("no client claims");
  });

  it("links to the service page from the nav and the hero", () => {
    const html = renderToString(<Home />);
    // next/link adds the trailing slash only inside a Next build (trailingSlash: true); the export output is checked in the UI gate.
    const links = html.match(new RegExp(`href="/services/${pseoService.slug}/?"`, "g")) ?? [];
    expect(links).toHaveLength(2);
  });
});

describe("service page", () => {
  it("renders the workflow, deliverables, evidence boundary and readiness gate", async () => {
    const html = renderToString(await ServicePage({ params: Promise.resolve({ slug: pseoService.slug }) }));
    expect(html).toContain(esc(pseoService.title));
    for (const item of [...pseoService.workflow, ...pseoService.deliverables, ...pseoService.evidence]) {
      expect(html).toContain(esc(item));
    }
    expect(html).toContain(esc(pseoService.readiness));
    expect(html).toContain("no inquiry intake");
    expect(html).toContain('type="application/ld+json"');
  });
});

describe("services index and 404", () => {
  it("lists the one service card and says there is no inquiry intake", () => {
    const html = renderToString(<ServicesPage />);
    expect(html).toContain(esc(pseoService.title));
    expect(html).toMatch(new RegExp(`href="/services/${pseoService.slug}/?"`));
    expect(html).toContain("public-safe · no inquiry intake");
  });

  it("renders the Thai not-found copy", () => {
    expect(renderToString(<NotFound />)).toContain("ไม่พบหน้านี้");
  });
});

describe("root layout", () => {
  it("is noindex by default and renders Thai html with a skip link", async () => {
    const { default: RootLayout, metadata } = await import("@/app/layout");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates).toBeUndefined();
    const html = renderToString(<RootLayout><p>child</p></RootLayout>);
    expect(html).toContain('lang="th"');
    expect(html).toContain('href="#main-content"');
    expect(html).toContain("<p>child</p>");
  });
});

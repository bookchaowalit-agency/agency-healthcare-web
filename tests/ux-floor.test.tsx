import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';
import ServicePage from '@/app/services/[slug]/page';
import { LangText } from '@/components/lang-text';
import { pseoService } from '@/lib/pseo';
import type { AgencyStatus } from '@/lib/readiness';
import { site } from '@/lib/site';
import { socialImage } from '@/lib/site-config';

// 2026-11-18 review: Thai nav, honest next step for each readiness state; 2026-11-19: no sitewide cross-site footer links.
describe('UX floor', () => {
  it('keeps cross-site links out of the shared footer: one in-content portfolio link on the home page only', async () => {
    const home = renderToString(<Home />);
    const service = renderToString(await ServicePage({ params: Promise.resolve({ slug: pseoService.slug }) }));
    // pSEO plan: no sitewide footer links across the 14 sites (they would read as a link network).
    for (const html of [home, service]) {
      const footer = html.slice(html.lastIndexOf('<footer'));
      expect(footer).not.toMatch(/href="https:\/\/(bookchaowalit\.com|agency\.bookchaowalit\.com)\/?(agencies)?"/);
      expect(footer).toContain('href="https://bookchaowalit.com/privacy"');
      expect(footer).toContain('href="https://monitor.bookchaowalit.com/"');
      expect(footer).toContain('href="mailto:bookchaowalit.work@gmail.com"');
    }
    expect(home.match(/href="https:\/\/agency\.bookchaowalit\.com[^"]*"/g)).toHaveLength(1);
    expect(home).not.toContain('href="https://bookchaowalit.com"');
    expect(service).not.toMatch(/href="https:\/\/agency\.bookchaowalit\.com/);
    expect(service).not.toContain('href="https://bookchaowalit.com"');
  });

  it('uses Thai nav labels that match the section headings', () => {
    const html = renderToString(<Home />);
    for (const label of ['ขอบเขต', 'ความพร้อม', 'บริการ']) expect(html).toContain(`>${label}</`);
    expect(html).not.toMatch(/>Scope</);
  });

  it('gives each readiness state a next step without inviting an inquiry before the gate opens', () => {
    const html = renderToString(<Home />);
    expect(html).toContain('ดูทั้ง 14 กลุ่มงาน');
    // The readiness note must not invite an email inquiry; the only mailto is the footer Contact link.
    expect(html.match(/href="mailto:/g)).toHaveLength(1);
    if ((site.status as AgencyStatus) === 'locked') expect(html).toContain('ยังไม่เปิดรับงาน');
    else expect(html).not.toContain('ยังไม่เปิดรับงาน');
  });

  it('shares the Open Graph image on service pages too', async () => {
    const { generateMetadata } = await import('@/app/services/[slug]/page');
    const meta = await generateMetadata({ params: Promise.resolve({ slug: pseoService.slug }) });
    // Whatever base URL this build uses (NEXT_PUBLIC_SITE_URL or the production fallback), the service page shares it.
    expect(JSON.stringify(meta.openGraph)).toContain(JSON.stringify(socialImage.url));
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('marks English runs in Thai copy with lang="en"', () => {
    expect(renderToString(<LangText text="ลดความเสี่ยงของ cyber-physical systems ด้วยหลักฐาน" />)).toContain('<span lang="en">cyber-physical systems</span>');
    expect(renderToString(<LangText text="ภาษาไทยล้วน" />)).toBe('ภาษาไทยล้วน');
  });

  it('draws the focus ring at 3:1 or more on the page background', () => {
    // Light :root tokens in cascade order: design-floor defaults, the site theme (if any), then globals.css.
    const tokens = new Map<string, string>();
    for (const file of ['design-floor/tokens.css', 'app-theme.css', 'globals.css']) {
      const path = join(process.cwd(), 'app', file);
      if (!existsSync(path)) continue;
      const root = readFileSync(path, 'utf8').match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';
      for (const [, name, value] of root.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) tokens.set(name, value.trim());
    }
    const resolve = (name: string, depth = 0): string | undefined => {
      const value = tokens.get(name);
      const ref = value?.match(/^var\(--([a-z0-9-]+)\)$/);
      return ref && depth < 8 ? resolve(ref[1], depth + 1) : value;
    };
    const fallback = readFileSync(join(process.cwd(), 'app', 'ux-floor.css'), 'utf8').match(/:focus-visible, a:focus-visible \{[^}]*var\(--focus, var\(--([a-z-]+)\)\)/)![1];
    const ring = resolve('focus') ?? resolve(fallback)!;
    const bg = resolve('bg')!;
    expect(ring).toMatch(/^#[0-9a-f]{6}$/i);
    expect(bg).toMatch(/^#[0-9a-f]{6}$/i);
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [luminance(ring), luminance(bg)].sort((x, y) => y - x);
    expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(3);
  });
});

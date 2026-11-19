import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';
import ServicePage from '@/app/services/[slug]/page';
import { LangText } from '@/components/lang-text';
import { pseoService } from '@/lib/pseo';
import type { AgencyStatus } from '@/lib/readiness';
import { site } from '@/lib/site';

// 2026-11-18 review: hub links, Thai nav, honest next step for each readiness state.
describe('UX floor', () => {
  it('links back to the hub and the agency portfolio from the home and service pages', async () => {
    const pages = [renderToString(<Home />), renderToString(await ServicePage({ params: Promise.resolve({ slug: pseoService.slug }) }))];
    for (const html of pages) {
      expect(html).toContain('href="https://bookchaowalit.com"');
      expect(html).toContain('href="https://agency.bookchaowalit.com/agencies"');
      expect(html).toContain('href="mailto:bookchaowalit.work@gmail.com"');
    }
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
    expect(JSON.stringify(meta.openGraph)).toContain('/opengraph-image');
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('marks English runs in Thai copy with lang="en"', () => {
    expect(renderToString(<LangText text="ลดความเสี่ยงของ cyber-physical systems ด้วยหลักฐาน" />)).toContain('<span lang="en">cyber-physical systems</span>');
    expect(renderToString(<LangText text="ภาษาไทยล้วน" />)).toBe('ภาษาไทยล้วน');
  });
});

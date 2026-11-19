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

  it('gives each readiness state a real next step', () => {
    const html = renderToString(<Home />);
    if ((site.status as AgencyStatus) === 'locked') {
      expect(html).toContain('ยังไม่เปิดรับงาน');
      expect(html).toContain('ดูกลุ่มงานที่เปิดอยู่');
    } else {
      expect(html).toContain('คุยเรื่องขอบเขตนี้ทางอีเมล');
      expect(html).not.toContain('ยังไม่เปิดรับงาน');
    }
  });

  it('marks English runs in Thai copy with lang="en"', () => {
    expect(renderToString(<LangText text="ลดความเสี่ยงของ cyber-physical systems ด้วยหลักฐาน" />)).toContain('<span lang="en">cyber-physical systems</span>');
    expect(renderToString(<LangText text="ภาษาไทยล้วน" />)).toBe('ภาษาไทยล้วน');
  });
});

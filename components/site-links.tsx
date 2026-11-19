// Footer on every page: privacy, public status and contact only. No sitewide links to the hub or the agency
// portfolio: 14 showcase domains all linking the same sites from every footer reads as a link network, which the
// pSEO plan forbids (docs/pseo-indexing-and-links-plan.md, Phase 3a + Guardrails). The home page carries one
// in-content link to the portfolio instead (app/page.tsx, readiness note).
export const contactHref = 'mailto:bookchaowalit.work@gmail.com';
export const portfolioHref = 'https://agency.bookchaowalit.com/agencies';

export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="ลิงก์เว็บไซต์">
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href={contactHref}>Contact</a>
    </nav>
  );
}

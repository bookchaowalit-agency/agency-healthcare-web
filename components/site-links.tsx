// Keep cross-site hub and portfolio links on the vertical showcase only. The service pages
// retain their privacy, public status and contact footer without creating a sitewide link network.
export const hubHref = 'https://bookchaowalit.com/';
export const contactHref = 'mailto:bookchaowalit.work@gmail.com';
export const portfolioHref = 'https://agency.bookchaowalit.com/agencies';

export default function SiteLinks({ includeHubAndPortfolio = false }: { includeHubAndPortfolio?: boolean }) {
  return (
    <nav className="site-links" aria-label="ลิงก์เว็บไซต์">
      {includeHubAndPortfolio ? <>
        <a href={hubHref}>bookchaowalit.com</a>
        <a href={portfolioHref}>agency.bookchaowalit.com/agencies</a>
      </> : null}
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href={contactHref}>Contact</a>
    </nav>
  );
}

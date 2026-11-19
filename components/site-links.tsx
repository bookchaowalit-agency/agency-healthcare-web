// Links back to the hub and the agency portfolio, plus privacy, public status and contact,
// on every page (same set as agency-main-web components/site-links.tsx).
export const contactHref = 'mailto:bookchaowalit.work@gmail.com';
export const portfolioHref = 'https://agency.bookchaowalit.com/agencies';

export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="ลิงก์เว็บไซต์">
      <a href="https://bookchaowalit.com">bookchaowalit.com</a>
      <a href={portfolioHref}>ทั้ง 14 กลุ่มงาน</a>
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href={contactHref}>Contact</a>
    </nav>
  );
}

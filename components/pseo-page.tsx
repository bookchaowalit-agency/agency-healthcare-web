import Link from 'next/link';
import SiteLinks from '@/components/site-links';
import { site } from '@/lib/site';
import { pseoService, type PseoService } from '@/lib/pseo';
import { serviceStructuredData } from '@/lib/structured-data';

const statusCopy = {
  incubating: { label: 'กำลังเปิดรอบ validation', note: 'กำลังทดสอบ buyer, offer และ delivery economics ก่อนเปิดรับงานในขอบเขตที่ชัดเจน' },
  target: { label: 'เตรียมไว้ใน portfolio', note: 'positioning พร้อมสำหรับการทดสอบ แต่ owner และหลักฐานการส่งมอบยังต้องผ่าน gate ก่อนเปิดรับงาน' },
  locked: { label: 'future capability', note: 'เก็บไว้สำหรับการวิจัยและวางพันธมิตร ยังไม่มีการรับข้อมูลหรือรับประกันบริการ' },
} as const;

export function PseoHeader() {
  return <header className="pseo-header"><Link className="pseo-brand" href="/"><span className="pseo-brand-mark" aria-hidden="true">{String(site.number).padStart(2, '0')}</span><span><strong>{site.name}</strong><small>{site.thaiName}</small></span></Link><nav className="pseo-nav" aria-label="เมนู service"><Link href="/">หน้าแรก</Link><Link href={`/services/${pseoService.slug}/`}>บริการ</Link></nav></header>;
}

export function PseoLandingPage({ service = pseoService }: { service?: PseoService }) {
  const readiness = statusCopy[service.agencyStatus];
  const structuredDataJson = serviceStructuredData(service);
  return <div className="pseo-shell"><PseoHeader /><main id="main-content" className="pseo-main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
    <nav className="pseo-breadcrumb" aria-label="Breadcrumb"><Link href="/services/">Service</Link><span aria-hidden="true">/</span><strong aria-current="page">{service.name}</strong></nav>
    <section className="pseo-hero" aria-labelledby="pseo-title"><div><p className="pseo-eyebrow">SERVICE / {service.agencyName.toUpperCase()}</p><h1 id="pseo-title">{service.title}</h1><p className="pseo-lede">{service.context}</p><div className="pseo-actions"><Link className="pseo-button" href="/">กลับไปดู showcase</Link><a className="pseo-text-link" href="#readiness">ดู readiness gate <span aria-hidden="true">↓</span></a></div></div><aside className="pseo-aside"><p className="pseo-eyebrow">SEARCH INTENT</p><strong>{service.intent}</strong><dl><div><dt>เหมาะกับ</dt><dd>{service.buyer}</dd></div><div><dt>สถานะ</dt><dd>{readiness.label}</dd></div></dl></aside></section>
    <section className="pseo-section" aria-labelledby="workflow-title"><div className="pseo-section-heading"><div><p className="pseo-eyebrow">HOW WE START</p><h2 id="workflow-title">เริ่มจาก workflow เดียว</h2></div><p>ขอบเขตเล็กพอที่จะวัดผลและตรวจรับได้ ก่อนตัดสินใจขยายระบบ</p></div><ol className="pseo-steps">{service.workflow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></section>
    <section className="pseo-section pseo-grid" aria-label="Deliverables and evidence"><article className="pseo-card pseo-card-dark"><p className="pseo-eyebrow">DELIVERABLES</p><h2>สิ่งที่จะได้</h2><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="pseo-card"><p className="pseo-eyebrow">EVIDENCE BOUNDARY</p><h2>สิ่งที่เราพูดได้ตรง ๆ</h2><ul>{service.evidence.map((item) => <li key={item}>{item}</li>)}</ul></article></section>
    <section id="readiness" className="pseo-section pseo-readiness" aria-labelledby="readiness-title"><div><p className="pseo-eyebrow">READINESS GATE / {service.agencyStage}</p><h2 id="readiness-title">ก่อนเปิดรับ inquiry</h2></div><p>{service.readiness}</p></section>
    <footer className="pseo-footer"><span>{site.name} · service page</span><span>{readiness.label} · public-safe · no inquiry intake</span><SiteLinks /></footer>
  </main></div>;
}

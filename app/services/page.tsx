import Link from 'next/link';
import SiteLinks from '@/components/site-links';
import { PseoHeader } from '@/components/pseo-page';
import { site } from '@/lib/site';
import { pseoService } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata(site.name + ' service', pseoService.description, '/services/');

export default function ServicesPage() {
  return <div className="pseo-shell"><PseoHeader /><main id="main-content" className="pseo-main"><section className="pseo-index-hero"><p className="pseo-eyebrow">SERVICE / PSEO PILOT</p><h1>เริ่มจาก service<br />ที่วัดผลได้</h1><p>หน้า service นี้อธิบาย workflow ตั้งต้นของ vertical แบบ public-safe เพื่อทดสอบ search intent และความพร้อมในการส่งมอบ ยังไม่มี lead form หรือการรับข้อมูลลูกค้า</p></section><section className="pseo-section"><Link className="pseo-index-card" href={`/services/${pseoService.slug}/`}><div><p className="pseo-eyebrow">{pseoService.name}</p><h2>{pseoService.title}</h2><p>{pseoService.intent}</p></div><span aria-hidden="true">↗</span></Link></section><footer className="pseo-footer"><span>{site.name} · service directory</span><span>public-safe · no inquiry intake</span><SiteLinks /></footer></main></div>;
}

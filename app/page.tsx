import Link from 'next/link';
import { pseoService } from '@/lib/pseo';
import { LangText } from '@/components/lang-text';
import SiteLinks, { portfolioHref } from '@/components/site-links';
import { type AgencyStatus, readinessCopy } from '@/lib/readiness';
import { site } from '@/lib/site';

function Artifact() {
  const labels = site.scope.slice(0, 4);

  switch (site.design.motif as string) {
    case 'editorial':
      return <div className="artifact artifact-editorial" aria-hidden="true"><span>NO. {String(site.number).padStart(2, '0')} / role scorecard</span><strong>Role scorecard</strong><ol className="editorial-rows"><li>ผลลัพธ์ที่ role ต้องส่ง</li><li>หลักฐานที่ใช้ตัดสินแต่ละข้อ</li><li>ผู้ตัดสินใจและจุดส่งต่อ</li></ol><i /><em>fit / proof / handoff</em></div>;
    case 'terminal':
      return <div className="artifact artifact-terminal" aria-hidden="true"><div className="terminal-top">READINESS_CONSOLE / {site.stage}</div>{labels.map((label, index) => <div className="terminal-row" key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><i /></div>)}<small>status: inspectable</small></div>;
    case 'blueprint':
      return <div className="artifact artifact-blueprint" aria-hidden="true"><span className="blueprint-axis blueprint-axis-x" /><span className="blueprint-axis blueprint-axis-y" /><span className="blueprint-node node-a" /><span className="blueprint-node node-b" /><span className="blueprint-node node-c" /><span className="blueprint-label label-a">ฐานเดิม</span><span className="blueprint-label label-b">ต้นแบบ</span><span className="blueprint-label label-c">ตรวจรับ</span><strong>ONE WORKFLOW</strong><small>baseline → prototype → acceptance</small></div>;
    case 'boardpaper':
      return <div className="artifact artifact-boardpaper" aria-hidden="true"><div className="boardpaper-head"><strong>CONTROL REGISTER</strong><span>REV / 01</span></div>{labels.map((label, index) => <div className="boardpaper-row" key={label}><span>0{index + 1}</span><strong>{label}</strong><i>owner / evidence</i></div>)}</div>;
    case 'dealroom':
      return <div className="artifact artifact-dealroom" aria-hidden="true"><div className="dealroom-ticker"><strong>FACT</strong><span>ASSUMPTION</span><em>GAP</em></div><div className="dealroom-bars"><i><b>ข้อเท็จจริง</b></i><i><b>สมมติฐาน</b></i><i><b>ช่องว่าง</b></i></div><small>DILIGENCE / TRACEABLE</small></div>;
    case 'fieldmanual':
      return <div className="artifact artifact-fieldmanual" aria-hidden="true"><div className="fieldmanual-stamp">FIELD<br />CHECK</div><div className="fieldmanual-route"><i /><i /><i /><i /></div><strong>ASSET / RISK / ACCEPTANCE</strong><small>HANDOFF MAP — REV A</small></div>;
    case 'labnote':
      return <div className="artifact artifact-labnote" aria-hidden="true"><span className="lab-orbit orbit-one" /><span className="lab-orbit orbit-two" /><span className="lab-node lab-node-a" /><span className="lab-node lab-node-b" /><span className="lab-node lab-node-c" /><strong>TECH → IP → MARKET</strong><small>unknowns remain visible</small></div>;
    case 'chambers':
      return <div className="artifact artifact-chambers" aria-hidden="true"><div className="chambers-seal">ก</div><div className="chambers-rule" /><strong>สิทธิ / หน้าที่ / ผู้รับผิดชอบ</strong><em>RIGHT / DUTY / OWNER</em><small>CAPABILITY FOLIO / FUTURE</small></div>;
    case 'capitalledger':
      return <div className="artifact artifact-capitalledger" aria-hidden="true"><div className="ledger-head"><strong>CAPITAL LEDGER</strong><span>THESIS</span></div>{labels.slice(0, 3).map((label, index) => <div className="ledger-row" key={label}><span>0{index + 1}</span><strong>{label}</strong><i /></div>)}<small>risk / governance / operations</small></div>;
    case 'clinical':
      return <div className="artifact artifact-clinical" aria-hidden="true"><div className="clinical-pulse"><i /><i /><i /><i /><i /></div><strong>SAFETY FIRST / EVIDENCE NEXT</strong><small>qualified review boundary</small></div>;
    case 'architectural':
      return <div className="artifact artifact-architectural" aria-hidden="true"><div className="plan-room room-one">DATA</div><div className="plan-room room-two">ASSET</div><div className="plan-room room-three">OPS</div><div className="plan-door" /><strong>PROPERTY OPERATING PLAN</strong></div>;
    case 'solarfield':
      return <div className="artifact artifact-solarfield" aria-hidden="true"><div className="solar-sun" /><span className="solar-orbit solar-orbit-one" /><span className="solar-orbit solar-orbit-two" /><strong>PROJECT / PERMIT / GRID</strong><small>OPERATING RISK VISIBLE</small></div>;
    case 'missionbrief':
      return <div className="artifact artifact-missionbrief" aria-hidden="true"><div className="mission-stamp">MISSION<br />ASSURANCE</div><div className="mission-grid"><i /><i /><i /><i /><i /><i /></div><strong>AUTHORIZATION BOUNDARY</strong></div>;
    case 'riskmatrix':
      return <div className="artifact artifact-riskmatrix" aria-hidden="true"><div className="risk-cells">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div><strong>EXPOSURE / CAPITAL / TRANSFER</strong><small>DATA BEFORE STRUCTURE</small></div>;
    default:
      return null;
  }
}

export default function HomePage() {
  const readiness = readinessCopy(site.status);
  // Widened so the same page compiles for every vertical, whatever its status literal.
  const locked = (site.status as AgencyStatus) === 'locked';
  const servicePath = `/services/${pseoService.slug}`;

  return (
    <div className={`site-shell archetype-${site.design.archetype}`} data-site={site.slug}>
      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">{String(site.number).padStart(2, '0')}</span>
          <span><strong>{site.name}</strong><small>{site.thaiName}</small></span>
        </a>
        <nav aria-label="เมนูหลัก"><a href="#offer">ขอบเขต</a><a href="#readiness">ความพร้อม</a><Link href={servicePath}>บริการ</Link></nav>
      </header>

      <main id="main-content" className="site-main">
        <section id="top" className="hero">
          <div className="hero-copy">
            <h1><LangText text={site.promise} /></h1>
            <p className="hero-thesis"><LangText text={site.design.thesis} /></p>
            <div className="hero-actions">
              <a className="primary-link" href="#offer">{site.cta}<span className="link-mark" aria-hidden="true" /></a>
              {locked ? <span className="status-badge">ยังไม่เปิดรับงาน</span> : null}
            </div>
            {locked ? <p className="locked-note">{site.fit} <a href={portfolioHref}>ดูทั้ง 14 กลุ่มงาน <span aria-hidden="true">↗</span></a></p> : null}
            <Link className="pseo-home-link" href={servicePath}>ดู service page <span aria-hidden="true">↗</span></Link>
            <div className="hero-meta"><span lang="en">{site.design.material}</span><span>showcase / {site.stage}</span></div>
          </div>
          <div className="hero-art">
            <Artifact />
            <p className="artifact-caption" lang="en">{site.design.artifactCaption}</p>
          </div>
        </section>

        <section className="signal-row" aria-label="ขอบเขตของ vertical">
          <div><span>สำหรับใคร</span><strong>{site.buyer}</strong></div>
          <div><span>เริ่มจาก</span><strong>{site.offer}</strong></div>
          <div><span>สถานะ</span><strong>{readiness.label}</strong></div>
        </section>

        <section className="story-section">
          <div><h2>โจทย์ที่ต้องทำให้เห็นชัด</h2></div>
          <p>{site.problem}</p>
        </section>

        <section id="offer" className="offer-section">
          <div className="offer-intro"><h2>{site.offer}</h2><p>{site.offerDetail}</p></div>
          <div className="offer-register">
            <div className="register-row"><span>ขอบเขตตั้งต้น</span><div className="scope-list">{site.scope.map((item) => <strong key={item}><LangText text={item} /></strong>)}</div></div>
            <div className="register-row"><span>สิ่งที่ต้อง build</span><p>{site.asset}</p></div>
            <div className="register-row"><span>fit ตอนนี้</span><p>{site.fit}</p></div>
          </div>
        </section>

        <section id="readiness" className="readiness-section">
          <div><h2>สถานะที่พูดได้ตรง ๆ</h2><p>หน้าเว็บนี้ใช้สำหรับ showcase และ message testing เท่านั้น ยังไม่มี lead form หรือการรับข้อมูลลูกค้า</p></div>
          <div className="readiness-note"><strong>{readiness.label}</strong><p>{readiness.note}</p>{/* No inquiry call to action until the readiness gate opens intake (AGENTS.md); point to the portfolio instead. */}<a className="readiness-link" href={portfolioHref}>ดูทั้ง 14 กลุ่มงาน <span aria-hidden="true">↗</span></a><span>{site.stage} / {site.status}</span></div>
        </section>

        <footer className="site-footer"><span>SE / {site.name}</span><span>public showcase · content-safe · no client claims</span><SiteLinks /></footer>
      </main>
    </div>
  );
}

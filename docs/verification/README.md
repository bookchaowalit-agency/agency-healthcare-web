# Verification

หลักฐานและ checklist สำหรับ Healthcare showcase

## pSEO service page

- Route: `/services/health-medtech-readiness-map/`
- ขอบเขต: workflow, deliverables, evidence boundary และ readiness ของ Healthcare
- ไม่มี lead form, API, database, analytics identifier หรือข้อมูลลูกค้า
- ค่าเริ่มต้นของ build เป็น `noindex` และ `Disallow: /`; เปิด index ได้เฉพาะเมื่อกำหนด `NEXT_PUBLIC_SITE_URL` และ `NEXT_PUBLIC_SITE_INDEXABLE=true` ที่ผ่านการอนุมัติ

## Local checks

```bash
npm run lint
npm test        # indexing gate, robots/sitemap (noindex default), pSEO route, renders, social card, Sentry
npm run check   # lint + typecheck + tests + static export
```

`tests/site.test.ts` and `tests/seo-routes.test.ts` pin the noindex / `Disallow: /` default; CI also greps
`out/robots.txt` for `Disallow: /`.

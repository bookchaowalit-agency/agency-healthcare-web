import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
import { siteConfig } from '@/lib/site-config';
import './design-floor/tokens.css';
import './globals.css';
import './ux-floor.css';

const notoSansThai = localFont({
  src: [
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '400', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '500', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '600', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans-thai',
  display: 'swap',
});

const notoSerifThai = localFont({
  src: [
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '400', style: 'normal' },
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '600', style: 'normal' },
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-serif-thai',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

export const metadata: Metadata = {
  // Only an approved public URL; without one Next.js uses the deployment URL, never localhost, for og:image.
  ...(siteConfig.publicUrl ? { metadataBase: new URL(siteConfig.publicUrl) } : {}),
  title: { default: site.name + ' — ' + site.thaiName, template: '%s — ' + site.name },
  description: site.promise,
  openGraph: { type: 'website', locale: 'th_TH', siteName: site.name, title: site.name + ' — ' + site.thaiName, description: site.promise },
  twitter: { card: 'summary_large_image', title: site.name + ' — ' + site.thaiName, description: site.promise },
  ...(siteConfig.publicUrl ? { alternates: { canonical: siteConfig.publicUrl } } : {}),
  robots: siteConfig.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="th" className={`${notoSansThai.variable} ${notoSerifThai.variable}`}><body><a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>{children}</body></html>;
}

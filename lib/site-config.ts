import type { Metadata } from 'next';
import { site } from './site.ts';

export type SiteEnv = Readonly<Record<string, string | undefined>>;

/**
 * Accept only absolute http(s) base URLs; strips trailing slashes. A query,
 * fragment or user:password would end up inside every canonical/sitemap URL
 * (paths are appended to this value), so those are rejected.
 */
export function parsePublicUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    if (url.search || url.hash || url.username || url.password || /[?#]/.test(trimmed)) return undefined;
    return url.toString().replace(/\/+$/, '');
  } catch {
    return undefined;
  }
}

/**
 * The site is noindex by default. It only becomes indexable when an approved
 * public URL is configured AND NEXT_PUBLIC_SITE_INDEXABLE is exactly "true".
 */
export function resolveSiteConfig(env: SiteEnv) {
  const publicUrl = parsePublicUrl(env.NEXT_PUBLIC_SITE_URL);
  return {
    name: site.name,
    description: site.promise,
    publicUrl,
    metadataUrl: publicUrl ?? 'http://localhost:3010',
    isIndexable: Boolean(publicUrl) && env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',
  } as const;
}

export type SiteConfig = ReturnType<typeof resolveSiteConfig>;

export const siteConfig: SiteConfig = resolveSiteConfig({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_INDEXABLE: process.env.NEXT_PUBLIC_SITE_INDEXABLE,
});

export function absoluteUrl(path: string, config: SiteConfig = siteConfig) {
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return config.metadataUrl + normalizedPath;
}

export function canonicalUrl(path: string, config: SiteConfig = siteConfig) {
  return config.publicUrl ? absoluteUrl(path, config) : undefined;
}

const ogImage = { url: '/opengraph-image', width: 1200, height: 630, alt: site.name } as const;

export function pageMetadata(title: string, description: string, path: string, config: SiteConfig = siteConfig): Metadata {
  const canonical = canonicalUrl(path, config);
  return {
    title,
    description,
    // Page-level openGraph replaces the layout's, so name the shared image (app/opengraph-image.tsx) here too.
    openGraph: { type: 'website', locale: 'th_TH', title, description, siteName: site.name, images: [ogImage], ...(canonical ? { url: canonical } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: config.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/** Paths published in the sitemap (trailing slash matches `trailingSlash: true`). */
export function sitemapPaths(serviceSlug: string) {
  return ['/', '/services/', '/services/' + serviceSlug + '/'];
}

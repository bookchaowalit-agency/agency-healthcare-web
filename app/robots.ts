import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

// Link-preview crawlers may read pages and /og.png so shared links get a social card while indexing is off;
// search engines stay out through Disallow plus the noindex robots meta on every page.
const linkPreviewBots = ['Twitterbot', 'facebookexternalhit', 'LinkedInBot', 'Slackbot', 'Slackbot-LinkExpanding', 'Discordbot', 'TelegramBot', 'WhatsApp'];

export default function robots(): MetadataRoute.Robots {
  return siteConfig.isIndexable
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') }
    : { rules: [{ userAgent: linkPreviewBots, allow: '/' }, { userAgent: '*', disallow: '/' }] };
}

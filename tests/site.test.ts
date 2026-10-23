import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { canonicalUrl, pageMetadata, parsePublicUrl, resolveSiteConfig, sitemapPaths } from '../lib/site-config.ts';
import { serviceStructuredData } from '../lib/structured-data.ts';
import { pseoService } from '../lib/pseo.ts';
import { site } from '../lib/site.ts';

describe('indexing gate', () => {
  it('stays noindex without an approved public URL and explicit flag', () => {
    assert.equal(resolveSiteConfig({}).isIndexable, false);
    assert.equal(resolveSiteConfig({ NEXT_PUBLIC_SITE_INDEXABLE: 'true' }).isIndexable, false);
    assert.equal(resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com' }).isIndexable, false);
    assert.equal(resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'TRUE' }).isIndexable, false);
    assert.equal(resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'true' }).isIndexable, true);
  });

  it('rejects non-http URLs and normalises trailing slashes', () => {
    assert.equal(parsePublicUrl('javascript:alert(1)'), undefined);
    assert.equal(parsePublicUrl('not a url'), undefined);
    assert.equal(parsePublicUrl(' https://example.com/ '), 'https://example.com');
  });

  it('emits canonical and robots metadata consistent with the gate', () => {
    const closed = resolveSiteConfig({});
    assert.equal(canonicalUrl('/services/', closed), undefined);
    assert.deepEqual(pageMetadata('t', 'd', '/', closed).robots, { index: false, follow: false });
    const open = resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    const metadata = pageMetadata('t', 'd', '/services/', open);
    assert.equal(metadata.alternates?.canonical, 'https://example.com/services/');
    assert.deepEqual(metadata.robots, { index: true, follow: true });
  });
});

describe('public-safe content', () => {
  it('has a kebab-case service slug and complete sections', () => {
    assert.match(pseoService.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const list of [pseoService.workflow, pseoService.deliverables, pseoService.evidence]) {
      assert.ok(list.length > 0);
      assert.equal(new Set(list).size, list.length, 'list items must be unique (used as React keys)');
    }
    assert.equal(pseoService.agencySlug, site.slug);
    assert.equal(pseoService.agencyStatus, site.status);
  });

  it('lists trailing-slash paths matching the static export', () => {
    for (const path of sitemapPaths(pseoService.slug)) assert.ok(path.endsWith('/'));
  });

  it('escapes < in JSON-LD so it cannot break out of the script tag', () => {
    const json = serviceStructuredData({ ...pseoService, title: '</script><script>alert(1)</script>' });
    assert.equal(json.includes('<'), false);
    assert.equal(JSON.parse(json)[0].name, '</script><script>alert(1)</script>');
  });
});

describe('social card text', () => {
  it('uses only ASCII strings, because the OG image font has no Thai glyphs', () => {
    const ascii = /^[\x20-\x7e—·]+$/;
    for (const text of [site.name, site.design.world, ...site.scope]) {
      assert.match(text, ascii, text);
    }
  });

  it('asks for a large card image on every page', () => {
    assert.equal((pageMetadata('t', 'd', '/') as { twitter?: { card?: string } }).twitter?.card, 'summary_large_image');
  });
});

describe('parsePublicUrl edge cases', () => {
  it('rejects base URLs whose query, fragment or credentials would leak into canonical links', () => {
    assert.equal(parsePublicUrl('https://example.com/?ref=x'), undefined);
    assert.equal(parsePublicUrl('https://example.com/#top'), undefined);
    assert.equal(parsePublicUrl('https://example.com/?'), undefined);
    assert.equal(parsePublicUrl('https://user:secret@example.com'), undefined);
  });

  it('strips every trailing slash so paths never start with //', () => {
    assert.equal(parsePublicUrl('https://example.com//'), 'https://example.com');
    assert.equal(parsePublicUrl('https://example.com/base/'), 'https://example.com/base');
    const config = resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com//' });
    assert.equal(canonicalUrl('/services/', config), 'https://example.com/services/');
  });
});

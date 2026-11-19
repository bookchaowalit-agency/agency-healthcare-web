// Writes the 1200x630 social card to public/og.png from lib/site.ts, plus lib/og-manifest.json (hashes of the
// card's inputs and of the PNG, which tests/opengraph.test.tsx checks). Run after changing the site's name,
// world, scope, colours or domain, then commit both files: node scripts/og.mjs
// A committed static file keeps /og.png an image/png without a route handler (AGENTS.md: no API routes).
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImageResponse } from 'next/og.js';
import { importTs } from './load-ts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { site } = await importTs(join(root, 'lib', 'site.ts'));
const { OG_SIZE, ogCard, ogFingerprint } = await importTs(join(root, 'lib', 'og-card.ts'));
const png = Buffer.from(await new ImageResponse(ogCard(site), OG_SIZE).arrayBuffer());
const sha = (data) => createHash('sha256').update(data).digest('hex');
mkdirSync(join(root, 'public'), { recursive: true });
writeFileSync(join(root, 'public', 'og.png'), png);
writeFileSync(join(root, 'lib', 'og-manifest.json'), JSON.stringify({ input: sha(ogFingerprint(site)), png: sha(png) }, null, 2) + '\n');
console.log(`wrote public/og.png (${png.length} bytes) and lib/og-manifest.json`);

// Writes the 1200x630 social card to public/og.png from lib/site.ts (run after changing the site's name,
// world, scope or colours, then commit the PNG): node scripts/og.mjs
// A committed static file keeps /og.png an image/png without a route handler (AGENTS.md: no API routes).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";
import { OG_SIZE, ogCard } from "../lib/og-card.ts";
import { site } from "../lib/site.ts";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og.png");
const png = Buffer.from(await new ImageResponse(ogCard(site), OG_SIZE).arrayBuffer());
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes)`);

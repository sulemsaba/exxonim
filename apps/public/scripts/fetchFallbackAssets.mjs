/**
 * Build-time script: fetches the latest API content and writes it as static
 * JSON files into public/fallback/. These files act as the offline-capable
 * fallback for when the live API is unavailable.
 *
 * Usage:  node scripts/fetchFallbackAssets.mjs
 * Env:    PUBLIC_API_BASE (default http://localhost:8000/api/v1)
 *
 * The generated files are committed alongside the rest of the public/ dir
 * so they exist in any deployment without a prior visit or service worker.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const outputDir = resolve(rootDir, "public", "fallback");

const API_BASE = process.env.PUBLIC_API_BASE ?? "http://localhost:8000/api/v1";

/* ── Endpoint descriptors ─────────────────────────────── */

const endpoints = [
  {
    key: "pricing",
    url: "/pricing/plans/",
    label: "pricing plans",
  },
  {
    key: "testimonials",
    url: "/testimonials/",
    label: "testimonials",
  },
  {
    key: "navigation",
    url: "/navigation/",
    label: "navigation items",
  },
  {
    key: "site-settings-brand",
    url: "/site-settings/brand/",
    label: "brand settings",
  },
  {
    key: "site-settings-company-info",
    url: "/site-settings/company_info/",
    label: "company info",
  },
  {
    key: "site-settings-footer",
    url: "/site-settings/footer/",
    label: "footer settings",
  },
  {
    key: "jobs",
    url: "/career/jobs/",
    label: "career jobs",
  },
  {
    key: "blog-posts",
    url: "/blog/posts/",
    label: "blog posts",
  },
  {
    key: "blog-categories",
    url: "/blog/categories/",
    label: "blog categories",
  },
  {
    key: "pages",
    url: "/pages/",
    label: "static pages",
  },
];

/* ── Helpers ──────────────────────────────────────────── */

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }

  return response.json();
}

function writeJsonFile(filePath, data) {
  return writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

/* ── Main ──────────────────────────────────────────────── */

async function main() {
  await mkdir(outputDir, { recursive: true });

  const start = Date.now();
  let fetched = 0;
  let failed = 0;

  for (const { key, url, label } of endpoints) {
    const fullUrl = `${API_BASE}${url}`;
    const filePath = resolve(outputDir, `${key}.json`);

    try {
      const data = await fetchJson(fullUrl);
      await writeJsonFile(filePath, data);
      console.log(`  ✓  ${label.padEnd(28)} → fallback/${key}.json`);
      fetched++;
    } catch (err) {
      console.warn(`  ✗  ${label.padEnd(28)} (${err.message})`);
      failed++;
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\nDone — ${fetched} fetched, ${failed} failed in ${elapsed}s`);

  if (failed > 0) {
    console.warn(
      `Some endpoints were unreachable. The existing fallback JSON files (if any) will still be used.`
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const htmlPath = resolve(distDir, "index.html");
const serverEntryPath = resolve(distDir, "server", "entry-server.js");
const { getPrerenderRoutes, renderPage, siteOrigin } = await import(
  pathToFileURL(serverEntryPath).href
);
const template = await readFile(htmlPath, "utf8");

function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceTitle(html, title) {
  return html.replace(/<title>.*?<\/title>/s, `<title>${escapeAttribute(title)}</title>`);
}

function replaceMetaContent(html, key, content) {
  return html.replace(
    new RegExp(`(<meta[^>]+data-exxonim="${key}"[^>]+content=")([^"]*)(")`, "i"),
    `$1${escapeAttribute(content)}$3`
  );
}

function replaceLinkHref(html, key, href) {
  return html.replace(
    new RegExp(`(<link[^>]+data-exxonim="${key}"[^>]+href=")([^"]*)(")`, "i"),
    `$1${escapeAttribute(href)}$3`
  );
}

function withSeo(templateHtml, seo) {
  let nextHtml = replaceTitle(templateHtml, seo.title);
  const canonicalUrl = new URL(seo.canonicalPath, siteOrigin).toString();

  nextHtml = replaceMetaContent(nextHtml, "description", seo.description);
  nextHtml = replaceMetaContent(nextHtml, "robots", seo.robots);
  nextHtml = replaceMetaContent(nextHtml, "og:type", seo.type);
  nextHtml = replaceMetaContent(nextHtml, "og:title", seo.title);
  nextHtml = replaceMetaContent(nextHtml, "og:description", seo.description);
  nextHtml = replaceMetaContent(nextHtml, "og:url", canonicalUrl);
  nextHtml = replaceMetaContent(nextHtml, "og:image", seo.image);
  nextHtml = replaceMetaContent(nextHtml, "twitter:card", "summary_large_image");
  nextHtml = replaceMetaContent(nextHtml, "twitter:title", seo.title);
  nextHtml = replaceMetaContent(nextHtml, "twitter:description", seo.description);
  nextHtml = replaceMetaContent(nextHtml, "twitter:image", seo.image);
  nextHtml = replaceLinkHref(nextHtml, "canonical", canonicalUrl);

  return nextHtml;
}

const prerenderRoutes = getPrerenderRoutes();

for (const route of prerenderRoutes) {
  const { appHtml, seo } = renderPage(route);
  const output = withSeo(
    template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
    seo
  );
  const targetPath =
    route === "/"
      ? resolve(distDir, "index.html")
      : resolve(distDir, route.slice(1), "index.html");

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, output, "utf8");
}

const { appHtml: notFoundHtml, seo: notFoundSeo } = renderPage("/404/");
const notFoundOutput = withSeo(
  template.replace('<div id="root"></div>', `<div id="root">${notFoundHtml}</div>`),
  notFoundSeo
);
await writeFile(resolve(distDir, "404.html"), notFoundOutput, "utf8");

const sitemapRoutes = prerenderRoutes.filter(
  (route) => route !== "/404/" && !route.startsWith("/blog/")
);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((route) => `  <url><loc>${new URL(route, siteOrigin).toString()}</loc></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(resolve(distDir, "sitemap.xml"), sitemap, "utf8");
await writeFile(
  resolve(distDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", siteOrigin).toString()}\n`,
  "utf8"
);

await rm(resolve(distDir, "server"), { recursive: true, force: true });

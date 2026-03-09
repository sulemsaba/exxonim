import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const htmlPath = resolve(distDir, "index.html");
const serverEntryPath = resolve(distDir, "server", "entry-server.js");
const staticRoutePaths = [
  "/",
  "/about/",
  "/services/",
  "/track-consultation/",
  "/resources/",
  "/career/",
  "/contact/",
];

const { render } = await import(pathToFileURL(serverEntryPath).href);
const template = await readFile(htmlPath, "utf8");

for (const route of staticRoutePaths) {
  const appHtml = render(route);
  const output = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  const targetPath =
    route === "/"
      ? resolve(distDir, "index.html")
      : resolve(distDir, route.slice(1), "index.html");

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, output, "utf8");
}

await rm(resolve(distDir, "server"), { recursive: true, force: true });

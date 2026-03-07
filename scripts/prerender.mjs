import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const htmlPath = resolve(distDir, "index.html");
const serverEntryPath = resolve(distDir, "server", "entry-server.js");

const { render } = await import(pathToFileURL(serverEntryPath).href);
const template = await readFile(htmlPath, "utf8");
const appHtml = render();
const output = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
);

await writeFile(htmlPath, output, "utf8");
await rm(resolve(distDir, "server"), { recursive: true, force: true });

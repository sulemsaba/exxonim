import { createReadStream, existsSync } from "node:fs";
import { stat, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = 4175;
const distDir = resolve(process.cwd(), "dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function getContentType(filePath) {
  return mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

async function resolvePath(urlPath) {
  const cleaned = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = join(distDir, cleaned);

  if (existsSync(requestedPath)) {
    const stats = await stat(requestedPath);
    if (stats.isDirectory()) {
      const indexPath = join(requestedPath, "index.html");
      if (existsSync(indexPath)) {
        return indexPath;
      }
    } else {
      return requestedPath;
    }
  }

  if (cleaned.startsWith("/admin/")) {
    return join(distDir, "admin", "index.html");
  }

  const staticIndexPath = join(distDir, cleaned, "index.html");
  if (existsSync(staticIndexPath)) {
    return staticIndexPath;
  }

  return join(distDir, "404.html");
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
    const filePath = await resolvePath(url.pathname === "/" ? "/index.html" : url.pathname);

    response.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
      "Content-Type": getContentType(filePath),
    });

    if (filePath.endsWith(".html")) {
      response.end(await readFile(filePath));
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end(error instanceof Error ? error.message : "Preview server failed.");
  }
});

server.listen(port, () => {
  process.stdout.write(`Previewing deploy artifact at http://localhost:${port}\n`);
});

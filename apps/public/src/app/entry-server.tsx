import { renderToString } from "react-dom/server";
import App from "./App";
import { AppProviders } from "./providers/AppProviders";
import { queryClient } from "./queryClient";
import { routes } from "./routes";
import { siteOrigin } from "./seo";
import { getBlogPrerenderRoutes, resolveServerSeo } from "./serverSeo";

export function render(url = "/") {
  return renderToString(
    <AppProviders>
      <App initialPathname={url} />
    </AppProviders>
  );
}

export async function renderPage(url = "/") {
  try {
    return {
      appHtml: render(url),
      seo: await resolveServerSeo(url),
    };
  } finally {
    queryClient.clear();
  }
}

export async function getPrerenderRoutes() {
  const staticRoutes = [...new Set(Object.values(routes))].filter(
    (route) =>
      route !== routes.admin &&
      route !== routes.adminLogin &&
      route !== routes.notFound
  );
  const blogRoutes = await getBlogPrerenderRoutes();

  return [...new Set([...staticRoutes, ...blogRoutes])];
}

export { siteOrigin };

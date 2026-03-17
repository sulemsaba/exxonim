import { renderToString } from "react-dom/server";
import App from "./App";
import { AppProviders } from "./providers/AppProviders";
import { getPageSeo, siteOrigin } from "./seo";
import { routes } from "./routes";

export function render(url = "/") {
  return renderToString(
    <AppProviders>
      <App initialPathname={url} />
    </AppProviders>
  );
}

export function renderPage(url = "/") {
  return {
    appHtml: render(url),
    seo: getPageSeo(url),
  };
}

export function getPrerenderRoutes() {
  return [...new Set(Object.values(routes))].filter(
    (route) => route !== routes.admin && route !== routes.adminLogin
  );
}

export { siteOrigin };

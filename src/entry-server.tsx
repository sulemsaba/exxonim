import { renderToString } from "react-dom/server";
import App from "./App";
import { AppProviders } from "./providers/AppProviders";
import { blogPosts } from "./content";
import { getPageSeo, siteOrigin } from "./seo";
import { legacyBlogPost, resourcePost, routes } from "./routes";

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
  const articleRoutes = blogPosts.flatMap((post) => [
    resourcePost(post.slug),
    legacyBlogPost(post.slug),
  ]);

  return [...new Set([...Object.values(routes), ...articleRoutes])];
}

export { siteOrigin };

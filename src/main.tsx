import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { AppProviders } from "./providers/AppProviders";
import { applyPageSeo } from "./seo";
import "./styles.css";

function bootstrapDocumentShell(pathname: string) {
  try {
    const savedTheme =
      localStorage.getItem("exxonim-theme") ??
      localStorage.getItem("koro-theme");

    document.documentElement.dataset.theme =
      savedTheme === "light" ? "light" : "dark";
  } catch {
    document.documentElement.dataset.theme = "dark";
  }

  document.documentElement.lang = "en";

  let viewportMeta = document.querySelector(
    'meta[name="viewport"]'
  ) as HTMLMetaElement | null;

  if (!viewportMeta) {
    viewportMeta = document.createElement("meta");
    viewportMeta.name = "viewport";
    viewportMeta.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(viewportMeta);
  }

  let charsetMeta = document.querySelector(
    "meta[charset]"
  ) as HTMLMetaElement | null;

  if (!charsetMeta) {
    charsetMeta = document.createElement("meta");
    charsetMeta.setAttribute("charset", "UTF-8");
    document.head.prepend(charsetMeta);
  }

  const ensureLink = (
    selector: string,
    setup: (link: HTMLLinkElement) => void
  ) => {
    let link = document.querySelector(selector) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      setup(link);
      document.head.appendChild(link);
    }
  };

  ensureLink('link[data-exxonim="logo-preload"]', (link) => {
    link.rel = "preload";
    link.as = "image";
    link.href = "/exxonim-logo.webp";
    link.type = "image/webp";
    link.setAttribute("fetchpriority", "high");
    link.setAttribute("data-exxonim", "logo-preload");
  });

  applyPageSeo(pathname);
}

bootstrapDocumentShell(window.location.pathname);

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container was not found.");
}

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <AppProviders>
      <App />
    </AppProviders>
  );
} else {
  createRoot(container).render(
    <AppProviders>
      <App />
    </AppProviders>
  );
}

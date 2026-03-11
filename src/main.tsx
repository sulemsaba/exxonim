import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

function bootstrapDocumentShell() {
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
  document.title = "Exxonim - Innovation Meets Efficiency";

  let metaDescription = document.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement | null;

  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    document.head.appendChild(metaDescription);
  }

  metaDescription.content =
    "Exxonim helps businesses, NGOs, and institutions with registration, licensing, statutory filing, and practical compliance support in Tanzania.";

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
}

bootstrapDocumentShell();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container was not found.");
}

if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}

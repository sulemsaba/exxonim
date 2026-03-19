import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProviders } from "./providers/AppProviders";
import "../styles.css";
import "../styles/admin-system.css";
import "../styles/admin-blog-editor.css";

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
}

bootstrapDocumentShell();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container was not found.");
}

createRoot(container).render(
  <AppProviders>
    <App />
  </AppProviders>
);

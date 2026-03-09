import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./revamp.css";
import "./navigation.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container was not found.");
}

if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}

import { startTransition, useEffect, useState } from "react";
import { isPublicAppRoute, normalizePathname } from "../routes";

interface PublicRouterOptions {
  initialPathname?: string;
}

function shouldHandleClientNavigation(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#")) {
    return false;
  }

  if (
    anchor.hasAttribute("download") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") {
    return false;
  }

  const rel = anchor.getAttribute("rel");
  if (rel && /\bexternal\b/i.test(rel)) {
    return false;
  }

  return true;
}

export function usePublicRouter({ initialPathname }: PublicRouterOptions = {}) {
  const [pathname, setPathname] = useState(() =>
    normalizePathname(
      typeof window === "undefined" ? initialPathname : window.location.pathname
    )
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      startTransition(() => {
        setPathname(normalizePathname(window.location.pathname));
      });
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!shouldHandleClientNavigation(anchor)) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) {
        return;
      }

      if (!isPublicAppRoute(nextUrl.pathname)) {
        return;
      }

      const nextPathname = normalizePathname(nextUrl.pathname);
      const samePath = nextPathname === normalizePathname(window.location.pathname);

      if (samePath && nextUrl.hash) {
        return;
      }

      event.preventDefault();

      const nextHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      window.history.pushState({}, "", nextHref);

      startTransition(() => {
        setPathname(nextPathname);
      });

      if (!nextUrl.hash) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return { pathname };
}

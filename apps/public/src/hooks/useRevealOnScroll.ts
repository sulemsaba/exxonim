import { useEffect } from "react";

export function useRevealOnScroll() {
  useEffect(() => {
    const observedNodes = new WeakSet<Element>();

    const markVisible = (node: Element) => {
      node.classList.add("is-visible");
    };

    const isAlreadyVisible = (node: Element) => {
      const rect = node.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
    };

    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((node) => markVisible(node));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markVisible(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const observeNode = (node: Element) => {
      if (observedNodes.has(node)) {
        return;
      }

      observedNodes.add(node);

      if (isAlreadyVisible(node)) {
        markVisible(node);
        return;
      }

      observer.observe(node);
    };

    const scanNodes = (root: ParentNode = document) => {
      if (root instanceof Element && root.matches("[data-reveal]")) {
        observeNode(root);
      }

      root
        .querySelectorAll?.<HTMLElement>("[data-reveal]")
        .forEach((node) => observeNode(node));
    };

    scanNodes();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            scanNodes(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);
}

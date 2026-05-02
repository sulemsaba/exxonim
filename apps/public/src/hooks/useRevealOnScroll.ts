import { useEffect, useRef } from "react";

/**
 * Applies scroll-reveal animation directly via inline styles.
 * No CSS classes required — pure Tailwind compatible.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const applyInvisible = (el: Element) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "0";
        el.style.transform = "translateY(16px)";
        el.style.transition = "opacity 620ms ease, transform 620ms ease";
      }
    };

    const applyVisible = (el: Element) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    };

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        applyVisible(el);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyVisible(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const observeNode = (node: Element) => {
      if (node instanceof HTMLElement) {
        applyInvisible(node);
        observer.observe(node);
      }
    };

    const scanNodes = (root: ParentNode = document) => {
      if (root instanceof Element && root.matches("[data-reveal]")) {
        observeNode(root);
      }
      root
        .querySelectorAll?.<HTMLElement>("[data-reveal]")
        .forEach((node) => observeNode(node));
    };

    // Check if already visible
    const isAlreadyVisible = (node: Element) => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
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

import { useEffect } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useStackCardDepth() {
  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stack-card]")
    );
    const cardInners = cards.map((card) =>
      card.querySelector<HTMLElement>(".stack-card__inner")
    );

    if (!cards.length) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const resetDepth = () => {
      cardInners.forEach((inner) => {
        if (!inner) {
          return;
        }

        inner.style.transform = "none";
        inner.style.filter = "none";
      });
    };

    const updateDepth = () => {
      if (window.innerWidth < 1280 || reducedMotionQuery.matches) {
        resetDepth();
        return;
      }

      const rootStyles = getComputedStyle(document.documentElement);
      const headerHeightValue = Number.parseFloat(
        rootStyles.getPropertyValue("--header-height")
      );
      const headerHeight = Number.isNaN(headerHeightValue)
        ? 92
        : headerHeightValue;
      const viewportHeight = window.innerHeight;
      const travelDistance = Math.max(viewportHeight - headerHeight, 1);

      cards.forEach((card, index) => {
        const inner = cardInners[index];
        const nextCard = cards[index + 1];

        if (!inner) {
          return;
        }

        if (!nextCard) {
          inner.style.transform = "none";
          inner.style.filter = "none";
          return;
        }

        const nextRect = nextCard.getBoundingClientRect();
        const progress = clamp(
          (viewportHeight - nextRect.top) / travelDistance,
          0,
          1
        );
        // Ease the outgoing card down and smaller as the next card enters view.
        const easedProgress = 1 - Math.pow(1 - progress, 2.2);
        const scale = 1 - easedProgress * 0.075;
        const translateY = easedProgress * 68;
        const brightness = 1 - easedProgress * 0.08;
        const saturation = 1 - easedProgress * 0.12;

        inner.style.transform =
          `translate3d(0, ${translateY.toFixed(2)}px, 0) ` +
          `scale(${scale.toFixed(5)})`;
        inner.style.filter =
          `brightness(${brightness.toFixed(3)}) ` +
          `saturate(${saturation.toFixed(3)})`;
      });
    };

    let ticking = false;

    const queueDepthUpdate = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(() => {
        updateDepth();
        ticking = false;
      });
    };

    updateDepth();
    window.addEventListener("scroll", queueDepthUpdate, { passive: true });
    window.addEventListener("resize", updateDepth);
    reducedMotionQuery.addEventListener("change", updateDepth);

    return () => {
      window.removeEventListener("scroll", queueDepthUpdate);
      window.removeEventListener("resize", updateDepth);
      reducedMotionQuery.removeEventListener("change", updateDepth);
      resetDepth();
    };
  }, []);
}

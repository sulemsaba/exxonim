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
      if (window.innerWidth < 861) {
        resetDepth();
        return;
      }

      const rootStyles = getComputedStyle(document.documentElement);
      const headerHeight =
        Number.parseFloat(rootStyles.getPropertyValue("--header-height")) || 92;
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
        const scale = 1 - progress * 0.048;
        const translateY = progress * 34;
        const brightness = 1 - progress * 0.08;

        inner.style.transform =
          `translate3d(0, ${translateY.toFixed(2)}px, 0) ` +
          `scale(${scale.toFixed(5)})`;
        inner.style.filter = `brightness(${brightness.toFixed(5)})`;
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

    return () => {
      window.removeEventListener("scroll", queueDepthUpdate);
      window.removeEventListener("resize", updateDepth);
      resetDepth();
    };
  }, []);
}

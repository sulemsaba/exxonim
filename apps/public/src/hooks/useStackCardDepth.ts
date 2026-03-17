import { useEffect } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTopOffset(index: number, viewportWidth: number) {
  if (viewportWidth < 768) {
    return index * 24;
  }

  if (viewportWidth < 1024) {
    return index * 32;
  }

  return index * 40;
}

function getMotionConfig(viewportWidth: number) {
  if (viewportWidth < 768) {
    return {
      revealWindow: 96,
      scaleFloor: 0.965,
      brightnessFloor: 0.93,
      saturationFloor: 0.98,
      translateMax: 2,
    };
  }

  if (viewportWidth < 1024) {
    return {
      revealWindow: 128,
      scaleFloor: 0.955,
      brightnessFloor: 0.91,
      saturationFloor: 0.97,
      translateMax: 4,
    };
  }

  return {
    revealWindow: 160,
    scaleFloor: 0.945,
    brightnessFloor: 0.89,
    saturationFloor: 0.96,
    translateMax: 6,
  };
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

        inner.style.removeProperty("--stack-depth-scale");
        inner.style.removeProperty("--stack-depth-y");
        inner.style.removeProperty("--stack-depth-brightness");
        inner.style.removeProperty("--stack-depth-saturation");
      });
    };

    const updateDepth = () => {
      if (reducedMotionQuery.matches) {
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
      const viewportWidth = window.innerWidth;
      const { revealWindow, scaleFloor, brightnessFloor, saturationFloor, translateMax } =
        getMotionConfig(viewportWidth);

      cards.forEach((card, index) => {
        const inner = cardInners[index];
        const nextCard = cards[index + 1];

        if (!inner) {
          return;
        }

        if (!nextCard) {
          inner.style.removeProperty("--stack-depth-scale");
          inner.style.removeProperty("--stack-depth-y");
          inner.style.removeProperty("--stack-depth-brightness");
          inner.style.removeProperty("--stack-depth-saturation");
          return;
        }

        const nextRect = nextCard.getBoundingClientRect();
        const stickyTarget = headerHeight + getTopOffset(index + 1, viewportWidth);
        const progress = clamp(
          (stickyTarget + revealWindow - nextRect.top) / revealWindow,
          0,
          1
        );
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        const scale = 1 - easedProgress * (1 - scaleFloor);
        const translateY = easedProgress * translateMax;
        const brightness =
          1 - easedProgress * (1 - brightnessFloor);
        const saturation =
          1 - easedProgress * (1 - saturationFloor);

        inner.style.setProperty("--stack-depth-scale", scale.toFixed(5));
        inner.style.setProperty(
          "--stack-depth-y",
          `${translateY.toFixed(2)}px`
        );
        inner.style.setProperty(
          "--stack-depth-brightness",
          brightness.toFixed(3)
        );
        inner.style.setProperty(
          "--stack-depth-saturation",
          saturation.toFixed(3)
        );
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
    window.addEventListener("resize", queueDepthUpdate);
    reducedMotionQuery.addEventListener("change", queueDepthUpdate);

    return () => {
      window.removeEventListener("scroll", queueDepthUpdate);
      window.removeEventListener("resize", queueDepthUpdate);
      reducedMotionQuery.removeEventListener("change", queueDepthUpdate);
      resetDepth();
    };
  }, []);
}

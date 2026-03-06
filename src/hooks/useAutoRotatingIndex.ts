import { useEffect, useState } from "react";

export function useAutoRotatingIndex(total: number, intervalMs: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % total);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, total]);

  return activeIndex;
}

import { useEffect, useRef, useState } from "react";
import {
  brand,
  heroMetrics,
  heroSlides,
  insightPosts,
  stackItems,
} from "./content";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { InsightsSection } from "./components/InsightsSection";
import { ProviderSection } from "./components/ProviderSection";
import { ResultsSection } from "./components/ResultsSection";
import { StackSection } from "./components/StackSection";
import { EngineSection } from "./components/EngineSection";
import { useAutoRotatingIndex } from "./hooks/useAutoRotatingIndex";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useStackCardDepth } from "./hooks/useStackCardDepth";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const activeSlideIndex = useAutoRotatingIndex(heroSlides.length, 2600);
  const blogRailRef = useRef<HTMLDivElement>(null);

  useRevealOnScroll();
  useStackCardDepth();

  useEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  useEffect(() => {
    const updateHeaderState = () => {
      setIsAtTop(window.scrollY < 18);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frameId = 0;
    const lerpFactor = 0.08;

    const handlePointerMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const updateScroll = () => {
      root.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };

    const animateGlow = () => {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      root.style.setProperty("--mouse-x", `${currentX}px`);
      root.style.setProperty("--mouse-y", `${currentY}px`);
      frameId = window.requestAnimationFrame(animateGlow);
    };

    root.style.setProperty("--mouse-x", `${currentX}px`);
    root.style.setProperty("--mouse-y", `${currentY}px`);
    updateScroll();
    frameId = window.requestAnimationFrame(animateGlow);

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  const scrollBlogRail = (direction: number) => {
    const rail = blogRailRef.current;

    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector<HTMLElement>(".blog-card");
    const scrollAmount = firstCard
      ? firstCard.getBoundingClientRect().width + 20
      : 360;

    rail.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="site-shell">
      <div className="cinematic-bg" aria-hidden="true">
        <div className="cinematic-bg__orb cinematic-bg__orb--one"></div>
        <div className="cinematic-bg__orb cinematic-bg__orb--two"></div>
        <div className="cinematic-bg__grid"></div>
        <div className="cinematic-bg__glow"></div>
      </div>

      <Header
        brand={brand}
        theme={theme}
        isAtTop={isAtTop}
        isNavOpen={isNavOpen}
        onToggleTheme={toggleTheme}
        onToggleNav={() => setIsNavOpen((current) => !current)}
        onNavLinkClick={handleNavLinkClick}
      />

      <main id="top">
        <HeroSection
          slides={heroSlides}
          metrics={heroMetrics}
          activeSlideIndex={activeSlideIndex}
        />
        <ProviderSection />
        <StackSection items={stackItems} />
        <EngineSection />
        <ResultsSection />
        <InsightsSection
          posts={insightPosts}
          railRef={blogRailRef}
          onPrev={() => scrollBlogRail(-1)}
          onNext={() => scrollBlogRail(1)}
        />
      </main>

      <Footer brand={brand} />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  brand,
  footerLinkGroups,
  heroMetrics,
  heroSlides,
  insightPosts,
  primaryNavLinks,
  providerLabels,
  serviceNavGroups,
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
      <Header
        brand={brand}
        navLinks={primaryNavLinks}
        serviceGroups={serviceNavGroups}
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
        <ProviderSection labels={providerLabels} />
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

      <Footer brand={brand} linkGroups={footerLinkGroups} />
    </div>
  );
}

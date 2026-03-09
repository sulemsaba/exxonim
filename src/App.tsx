import { useEffect, useRef, useState } from "react";
import { brand, heroMetrics, heroSlides, insightPosts, stackItems } from "./content";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { InsightsSection } from "./components/InsightsSection";
import { ProviderSection } from "./components/ProviderSection";
import { ResultsSection } from "./components/ResultsSection";
import { EngineSection } from "./components/EngineSection";
import { StackSection } from "./components/StackSection";
import { useAutoRotatingIndex } from "./hooks/useAutoRotatingIndex";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useStackCardDepth } from "./hooks/useStackCardDepth";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const activeSlideIndex = useAutoRotatingIndex(heroSlides.length, 2600);
  const blogRailRef = useRef<HTMLDivElement>(null);
  const navHistoryEntryRef = useRef(false);
  const closingNavFromHistoryRef = useRef(false);

  useRevealOnScroll();
  useStackCardDepth();
  useEffect(() => {
    document.documentElement.classList.add("js");
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

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth >= 1280) {
        setIsNavOpen(false);
      }
    };

    const handleOrientationChange = () => {
      window.requestAnimationFrame(handleViewportChange);
    };

    const handlePopState = () => {
      if (!navHistoryEntryRef.current) {
        return;
      }

      closingNavFromHistoryRef.current = true;
      navHistoryEntryRef.current = false;
      setIsNavOpen(false);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
      }
    };

    document.body.style.overflow = isNavOpen ? "hidden" : "";
    root.classList.toggle("nav-open", isNavOpen);

    if (isNavOpen && !navHistoryEntryRef.current) {
      window.history.pushState(
        { ...(window.history.state ?? {}), mobileNavOpen: true },
        "",
        window.location.href,
      );
      navHistoryEntryRef.current = true;
    }

    if (!isNavOpen && navHistoryEntryRef.current && !closingNavFromHistoryRef.current) {
      navHistoryEntryRef.current = false;

      if (window.history.state?.mobileNavOpen) {
        window.history.back();
      }
    }

    if (!isNavOpen) {
      closingNavFromHistoryRef.current = false;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      root.classList.remove("nav-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNavOpen]);

  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const scrollBlogRail = (direction: number) => {
    const rail = blogRailRef.current;

    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector<HTMLElement>(".resource-card");
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
        isNavOpen={isNavOpen}
        onToggleTheme={toggleTheme}
        onToggleNav={() => setIsNavOpen((current) => !current)}
        onCloseNav={closeNav}
        onNavLinkClick={handleNavLinkClick}
      />

      <main id="top" className="site-main">
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

      <a
        className="whatsapp-float"
        href="https://wa.me/255794689099"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-float__pulse" aria-hidden="true"></span>
        <svg
          className="whatsapp-float__icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.01 2.014a9.96 9.96 0 0 0-8.52 15.11L2 22l4.985-1.465a9.961 9.961 0 1 0 5.025-18.52Zm0 18.067a8.093 8.093 0 0 1-4.14-1.134l-.297-.176-3.082.906.924-2.977-.193-.306A8.098 8.098 0 1 1 12.01 20.08Zm4.437-6.042c-.244-.122-1.439-.711-1.662-.793-.223-.081-.385-.122-.547.122-.162.244-.628.793-.77.955-.142.162-.284.183-.528.061-1.18-.56-2.072-1.1-2.884-2.522-.083-.146-.01-.223.111-.345.11-.11.244-.284.366-.427.122-.142.162-.244.244-.407.081-.162.041-.305-.02-.427-.061-.122-.547-1.32-.75-1.808-.198-.475-.399-.411-.547-.419-.142-.008-.305-.008-.468-.008-.162 0-.427.061-.65.305-.223.244-.852.833-.852 2.032s.873 2.358.995 2.522c.122.162 1.714 2.628 4.153 3.67.58.24 1.033.383 1.385.49.582.185 1.112.158 1.531.096.47-.07 1.439-.588 1.642-1.157.203-.569.203-1.056.142-1.157-.061-.101-.223-.162-.468-.284Z" />
        </svg>
      </a>
    </div>
  );
}

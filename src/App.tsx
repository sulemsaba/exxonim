import { useEffect, useRef } from "react";
import {
  brand,
  insightPosts,
  stackItems,
} from "./content";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useStackCardDepth } from "./hooks/useStackCardDepth";
import { useTheme } from "./hooks/useTheme";
import { normalizePathname, routes } from "./routes";
import { AboutPage } from "./pages/AboutPage";
import { CareerPage } from "./pages/CareerPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ServicesPage } from "./pages/ServicesPage";
import { TrackConsultationPage } from "./pages/TrackConsultationPage";

interface AppProps {
  initialPathname?: string;
}

export default function App({ initialPathname }: AppProps) {
  const { theme, toggleTheme } = useTheme();
  const railRef = useRef<HTMLDivElement>(null);
  const pathname =
    typeof window === "undefined"
      ? normalizePathname(initialPathname)
      : normalizePathname(window.location.pathname);

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

  const scrollRail = (direction: number) => {
    const rail = railRef.current;

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

  const sharedResourcePageProps = {
    posts: insightPosts,
    railRef,
    onPrev: () => scrollRail(-1),
    onNext: () => scrollRail(1),
  };

  const page =
    pathname === normalizePathname(routes.about) ? (
      <AboutPage stackItems={stackItems} />
    ) : pathname === normalizePathname(routes.services) ? (
      <ServicesPage />
    ) : pathname === normalizePathname(routes.tracking) ? (
      <TrackConsultationPage />
    ) : pathname === normalizePathname(routes.resources) ? (
      <ResourcesPage {...sharedResourcePageProps} />
    ) : pathname === normalizePathname(routes.career) ? (
      <CareerPage />
    ) : pathname === normalizePathname(routes.contact) ? (
      <ContactPage />
    ) : (
      <HomePage
        stackItems={stackItems}
        {...sharedResourcePageProps}
      />
    );

  return (
    <div className="site-shell">
      <div className="cinematic-bg" aria-hidden="true">
        <div className="cinematic-bg__orb cinematic-bg__orb--one"></div>
        <div className="cinematic-bg__orb cinematic-bg__orb--two"></div>
        <div className="cinematic-bg__grid"></div>
        <div className="cinematic-bg__glow"></div>
      </div>

      <Navigation
        pathname={pathname}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main id="top" className="site-main">
        {page}
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

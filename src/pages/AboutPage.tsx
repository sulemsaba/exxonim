import { HeroSection } from "../components/HeroSection";
import { ProviderSection } from "../components/ProviderSection";
import { StackSection } from "../components/StackSection";
import type { HeroMetric, HeroSlide, StackItem } from "../types";

interface AboutPageProps {
  slides: HeroSlide[];
  metrics: HeroMetric[];
  activeSlideIndex: number;
  stackItems: StackItem[];
}

export function AboutPage({
  slides,
  metrics,
  activeSlideIndex,
  stackItems,
}: AboutPageProps) {
  return (
    <>
      <HeroSection
        slides={slides}
        metrics={metrics}
        activeSlideIndex={activeSlideIndex}
      />
      <ProviderSection />
      <StackSection items={stackItems} />
    </>
  );
}

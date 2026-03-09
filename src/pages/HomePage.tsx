import type { RefObject } from "react";
import { EngineSection } from "../components/EngineSection";
import { HeroSection } from "../components/HeroSection";
import { InsightsSection } from "../components/InsightsSection";
import { ProviderSection } from "../components/ProviderSection";
import { ResultsSection } from "../components/ResultsSection";
import { StackSection } from "../components/StackSection";
import type { HeroMetric, HeroSlide, InsightPost, StackItem } from "../types";

interface HomePageProps {
  slides: HeroSlide[];
  metrics: HeroMetric[];
  activeSlideIndex: number;
  stackItems: StackItem[];
  posts: InsightPost[];
  railRef: RefObject<HTMLDivElement>;
  onPrev: () => void;
  onNext: () => void;
}

export function HomePage({
  slides,
  metrics,
  activeSlideIndex,
  stackItems,
  posts,
  railRef,
  onPrev,
  onNext,
}: HomePageProps) {
  return (
    <>
      <HeroSection
        slides={slides}
        metrics={metrics}
        activeSlideIndex={activeSlideIndex}
      />
      <ProviderSection />
      <StackSection items={stackItems} />
      <EngineSection />
      <ResultsSection />
      <InsightsSection
        posts={posts}
        railRef={railRef}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}

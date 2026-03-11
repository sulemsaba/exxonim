import type { RefObject } from "react";
import { EngineSection } from "../components/EngineSection";
import { InsightsSection } from "../components/InsightsSection";
import { ProviderSection } from "../components/ProviderSection";
import { ReferenceHero } from "../components/ReferenceHero";
import { StackSection } from "../components/StackSection";
import type { InsightPost, StackItem } from "../types";

interface HomePageProps {
  stackItems: StackItem[];
  posts: InsightPost[];
  railRef: RefObject<HTMLDivElement>;
  onPrev: () => void;
  onNext: () => void;
}

export function HomePage({
  stackItems,
  posts,
  railRef,
  onPrev,
  onNext,
}: HomePageProps) {
  return (
    <>
      <ReferenceHero />
      <ProviderSection />
      <StackSection items={stackItems} />
      <EngineSection />
      <InsightsSection
        posts={posts}
        railRef={railRef}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}

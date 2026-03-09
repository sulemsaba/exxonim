import type { RefObject } from "react";
import { InsightsSection } from "../components/InsightsSection";
import type { InsightPost } from "../types";

interface ResourcesPageProps {
  posts: InsightPost[];
  railRef: RefObject<HTMLDivElement>;
  onPrev: () => void;
  onNext: () => void;
}

export function ResourcesPage({
  posts,
  railRef,
  onPrev,
  onNext,
}: ResourcesPageProps) {
  return (
    <InsightsSection
      posts={posts}
      railRef={railRef}
      onPrev={onPrev}
      onNext={onNext}
    />
  );
}

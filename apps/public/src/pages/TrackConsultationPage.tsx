import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ResultsSection } from "../components/ResultsSection";
import { usePage } from "../hooks/usePage";
import type { TrackingSectionContent } from "../types";

export function TrackConsultationPage() {
  const { data: page, isPending, error } =
    usePage<TrackingSectionContent>("track-consultation");

  if (isPending) {
    return <LoadingSpinner label="Loading consultation tracking..." />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load consultation tracking."
        detail="Check that the page endpoint is available."
      />
    );
  }

  return <ResultsSection content={page.content} />;
}

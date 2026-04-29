import type { ReactNode } from "react";
import { ErrorMessage } from "./ErrorMessage";

type LoadBoundaryVariant = "page" | "section";
type LoadBoundaryChildren = ReactNode | (() => ReactNode);

interface LoadBoundaryProps {
  children: LoadBoundaryChildren;
  error?: unknown;
  errorDetail?: string;
  errorTitle?: string;
  isPending: boolean;
  isReady?: boolean;
  loadingLabel?: string;
  variant?: LoadBoundaryVariant;
}

interface SkeletonProps {
  label: string;
  variant: LoadBoundaryVariant;
}

function ContentSkeleton({ label, variant }: SkeletonProps) {
  return (
    <div
      className={`content-skeleton content-skeleton--${variant}`}
      role="status"
      aria-live="polite"
    >
      <div className="content-skeleton__hero">
        <div className="content-skeleton__row content-skeleton__row--pill" />
        <div className="content-skeleton__row content-skeleton__row--title" />
        <div className="content-skeleton__row content-skeleton__row--body" />
        <div className="content-skeleton__row content-skeleton__row--body" />
      </div>
      <div className="content-skeleton__grid" aria-hidden="true">
        <div className="content-skeleton__card" />
        <div className="content-skeleton__card" />
        <div className="content-skeleton__card" />
      </div>
      <p className="content-skeleton__label">{label}</p>
    </div>
  );
}

export function LoadBoundary({
  children,
  error,
  errorDetail = "This section could not be loaded right now. Please try again in a moment.",
  errorTitle = "Unable to load content.",
  isPending,
  isReady = true,
  loadingLabel = "Loading content...",
  variant = "page",
}: LoadBoundaryProps) {
  if (isPending && !isReady) {
    return <ContentSkeleton label={loadingLabel} variant={variant} />;
  }

  if (isReady) {
    return <>{typeof children === "function" ? children() : children}</>;
  }

  if (error || !isReady) {
    return (
      <ErrorMessage
        compact={variant === "section"}
        detail={errorDetail}
        title={errorTitle}
      />
    );
  }

  return null;
}

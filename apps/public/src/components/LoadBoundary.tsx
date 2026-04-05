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
  const compact = variant === "section";

  return (
    <>
      <style>{`
        .content-skeleton {
          --skeleton-surface: rgba(248, 249, 246, 0.76);
          --skeleton-border: var(--color-border-soft);
          --skeleton-shadow: 0 18px 38px rgba(8, 31, 35, 0.08);
          --skeleton-sheen: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.58) 45%,
            rgba(255, 255, 255, 0) 100%
          );
          display: grid;
          gap: ${compact ? "1rem" : "1.5rem"};
          padding: ${compact ? "1.2rem" : "2rem"};
          min-height: ${compact ? "15rem" : "clamp(24rem, 48vh, 34rem)"};
          border: 1px solid var(--skeleton-border);
          border-radius: ${compact ? "1.35rem" : "1.8rem"};
          background: var(--skeleton-surface);
          box-shadow: var(--skeleton-shadow);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .content-skeleton--page {
          width: min(1180px, calc(100% - 2rem));
          margin: 1.5rem auto 0;
        }

        .content-skeleton--section {
          width: 100%;
        }

        .content-skeleton__row,
        .content-skeleton__card {
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(15, 92, 99, 0.08);
        }

        .content-skeleton__card {
          border-radius: 1.25rem;
          min-height: ${compact ? "7rem" : "9rem"};
          border: 1px solid rgba(15, 92, 99, 0.08);
        }

        .content-skeleton__row::after,
        .content-skeleton__card::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: var(--skeleton-sheen);
          animation: content-skeleton-shimmer 1.8s ease-in-out infinite;
        }

        .content-skeleton__hero {
          display: grid;
          gap: 0.8rem;
        }

        .content-skeleton__row--pill {
          width: 7rem;
          height: 1rem;
        }

        .content-skeleton__row--title {
          width: min(30rem, 88%);
          height: ${compact ? "1.5rem" : "2.8rem"};
        }

        .content-skeleton__row--body {
          width: min(36rem, 100%);
          height: 1rem;
        }

        .content-skeleton__grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(${compact ? 1 : 3}, minmax(0, 1fr));
        }

        .content-skeleton__label {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        @media (max-width: 860px) {
          .content-skeleton--page {
            width: calc(100% - 1.5rem);
          }

          .content-skeleton__grid {
            grid-template-columns: 1fr;
          }
        }

        @keyframes content-skeleton-shimmer {
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
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
    </>
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
  if (isPending) {
    return <ContentSkeleton label={loadingLabel} variant={variant} />;
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

  return <>{typeof children === "function" ? children() : children}</>;
}

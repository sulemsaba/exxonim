interface LoadingSpinnerProps {
  label?: string;
  compact?: boolean;
  minHeight?: string;
}

export function LoadingSpinner({
  label = "Loading content...",
  compact = false,
  minHeight,
}: LoadingSpinnerProps) {
  const reservedHeight = minHeight ?? (compact ? undefined : "clamp(18rem, 42vh, 28rem)");

  return (
    <>
      <style>{`
        .loading-spinner {
          display: grid;
          place-items: center;
          gap: 0.9rem;
          padding: ${compact ? "1rem" : "3rem 1.25rem"};
          min-height: ${reservedHeight ?? "auto"};
          color: var(--color-text-muted);
          text-align: center;
        }

        .loading-spinner__orb {
          width: ${compact ? "1.25rem" : "2rem"};
          height: ${compact ? "1.25rem" : "2rem"};
          border: 2px solid rgba(15, 92, 99, 0.18);
          border-top-color: var(--color-accent);
          border-radius: 999px;
          animation: loading-spinner-rotate 0.8s linear infinite;
        }

        .loading-spinner__label {
          margin: 0;
          font-size: ${compact ? "0.9rem" : "1rem"};
          line-height: 1.6;
        }

        @keyframes loading-spinner-rotate {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="loading-spinner" role="status" aria-live="polite">
        <span className="loading-spinner__orb" aria-hidden="true"></span>
        <p className="loading-spinner__label">{label}</p>
      </div>
    </>
  );
}

interface ErrorMessageProps {
  title?: string;
  detail?: string;
  compact?: boolean;
}

export function ErrorMessage({
  title = "Unable to load content.",
  detail = "Check that the backend API is running and try again.",
  compact = false,
}: ErrorMessageProps) {
  return (
    <>
      <style>{`
        .error-message {
          display: grid;
          gap: 0.55rem;
          padding: ${compact ? "1rem" : "1.25rem"};
          border: 1px solid rgba(168, 35, 58, 0.14);
          border-radius: 1.15rem;
          background: rgba(255, 247, 248, 0.9);
          color: var(--color-text);
          box-shadow: 0 14px 30px rgba(140, 35, 56, 0.06);
        }

        .error-message__title {
          margin: 0;
          font-size: ${compact ? "0.95rem" : "1rem"};
          font-weight: 700;
          color: #8c2338;
        }

        .error-message__detail {
          margin: 0;
          color: var(--color-text-muted);
          font-size: ${compact ? "0.9rem" : "0.95rem"};
          line-height: 1.6;
        }
      `}</style>
      <div className="error-message" role="alert">
        <p className="error-message__title">{title}</p>
        <p className="error-message__detail">{detail}</p>
      </div>
    </>
  );
}

interface ErrorMessageProps {
  title?: string;
  detail?: string;
  compact?: boolean;
}

export function ErrorMessage({
  title = "Unable to load content.",
  detail = "This content is unavailable right now. Please try again in a moment.",
  compact = false,
}: ErrorMessageProps) {
  return (
    <div
      className={`error-message${compact ? " error-message--compact" : ""}`}
      role="alert"
    >
      <p className="error-message__title">{title}</p>
      <p className="error-message__detail">{detail}</p>
    </div>
  );
}

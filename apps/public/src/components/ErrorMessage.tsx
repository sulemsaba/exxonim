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
      className={compact ? "rounded-xl border border-border-soft bg-page p-4" : "rounded-2xl border border-border-soft bg-page p-8 text-center"}
      role="alert"
    >
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 text-sm text-text-muted">{detail}</p>
    </div>
  );
}

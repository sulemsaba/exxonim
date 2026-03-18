import type { ReactNode } from "react";

interface AdminEmptyStateProps {
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

export function AdminEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: AdminEmptyStateProps) {
  return (
    <div className="adminx-empty">
      <strong>{title}</strong>
      <p>{description}</p>
      {primaryAction ? <div className="adminx-page-header__actions">{primaryAction}</div> : null}
      {secondaryAction ? <div className="adminx-page-header__actions">{secondaryAction}</div> : null}
    </div>
  );
}

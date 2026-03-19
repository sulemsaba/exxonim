import type { ReactNode } from "react";

interface AdminToolbarProps {
  meta?: ReactNode;
  actions?: ReactNode;
}

export function AdminToolbar({ meta, actions }: AdminToolbarProps) {
  if (!meta && !actions) {
    return null;
  }

  return (
    <div className="admin-toolbar">
      {meta ? <span className="admin-toolbar__meta">{meta}</span> : <span />}
      {actions ? <div className="admin-toolbar__actions">{actions}</div> : null}
    </div>
  );
}

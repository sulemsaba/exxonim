import type { ReactNode } from "react";

interface AdminSectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminSectionCard({
  title,
  description,
  actions,
  children,
}: AdminSectionCardProps) {
  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions}
      </div>
      <div className="admin-card__body">{children}</div>
    </section>
  );
}

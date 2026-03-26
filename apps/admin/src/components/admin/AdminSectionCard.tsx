import { useState, type ReactNode } from "react";

interface AdminSectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  variant?: "default" | "editorial" | "inspector";
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AdminSectionCard({
  title,
  description,
  actions,
  className,
  variant = "default",
  collapsible = false,
  defaultOpen = true,
  children,
}: AdminSectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const showHeader = collapsible || title || description || actions;
  const cardClassName = [
    "admin-card",
    variant !== "default" ? `admin-card--${variant}` : "",
    collapsible ? "admin-card--collapsible" : "",
    collapsible && !isOpen ? "is-collapsed" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cardClassName}>
      {showHeader ? (
        <div className="admin-card__header">
          <div className="admin-card__copy">
            {title ? <h2>{title}</h2> : null}
            {description ? <p>{description}</p> : null}
          </div>
          <div className="admin-card__actions">
            {actions}
            {collapsible ? (
              <button
                className="admin-card__toggle"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((currentValue) => !currentValue)}
              >
                {isOpen ? "Collapse" : "Expand"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {!collapsible || isOpen ? <div className="admin-card__body">{children}</div> : null}
    </section>
  );
}

import { useState, type PropsWithChildren, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  adminNavItems,
  type AdminBreadcrumb,
  type AdminSection,
} from "../../lib/adminRoutes";

interface AdminLayoutProps extends PropsWithChildren {
  activeSection: AdminSection;
  title: string;
  description: string;
  breadcrumbs: AdminBreadcrumb[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
  actions?: ReactNode;
}

const adminLayoutStyles = String.raw`
  .admin-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(16rem, 19rem) minmax(0, 1fr);
    color: var(--color-text);
  }

  .admin-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    display: grid;
    align-content: start;
    gap: 1.2rem;
    padding: 1.4rem 1rem 1.4rem 1.15rem;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    background:
      linear-gradient(180deg, rgba(6, 24, 27, 0.92), rgba(10, 32, 36, 0.94)),
      rgba(6, 24, 27, 0.96);
    color: rgba(240, 248, 249, 0.92);
  }

  .admin-sidebar--collapsed {
    grid-template-rows: auto auto 1fr;
  }

  .admin-sidebar__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .admin-sidebar__brand {
    display: grid;
    gap: 0.35rem;
  }

  .admin-sidebar__brand strong {
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }

  .admin-sidebar__brand span {
    color: rgba(199, 221, 223, 0.7);
    font-size: 0.86rem;
    line-height: 1.55;
  }

  .admin-sidebar__toggle,
  .admin-header__theme,
  .admin-header__logout,
  .admin-action-button,
  .admin-secondary-button,
  .admin-danger-button,
  .admin-table__action,
  .admin-form__submit,
  .admin-form__cancel {
    border: 0;
    border-radius: 0.95rem;
    cursor: pointer;
    font: inherit;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease,
      opacity 180ms ease;
  }

  .admin-sidebar__toggle:hover,
  .admin-header__theme:hover,
  .admin-header__logout:hover,
  .admin-action-button:hover,
  .admin-secondary-button:hover,
  .admin-danger-button:hover,
  .admin-table__action:hover,
  .admin-form__submit:hover,
  .admin-form__cancel:hover {
    transform: translateY(-1px);
  }

  .admin-sidebar__toggle {
    min-width: 2.7rem;
    min-height: 2.7rem;
    background: rgba(255, 255, 255, 0.07);
    color: rgba(240, 248, 249, 0.92);
  }

  .admin-sidebar__nav {
    display: grid;
    gap: 0.45rem;
  }

  .admin-sidebar__link {
    display: grid;
    gap: 0.2rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid transparent;
    border-radius: 1rem;
    color: inherit;
    background: transparent;
  }

  .admin-sidebar__link strong {
    font-size: 0.92rem;
  }

  .admin-sidebar__link span {
    color: rgba(199, 221, 223, 0.66);
    font-size: 0.76rem;
    line-height: 1.45;
  }

  .admin-sidebar__link--active {
    border-color: rgba(127, 188, 193, 0.22);
    background: rgba(127, 188, 193, 0.12);
  }

  .admin-main {
    min-width: 0;
    padding: 1.4rem 1.4rem 3rem;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1.25rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 1.4rem;
    background: rgba(248, 249, 246, 0.74);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .admin-header__copy {
    display: grid;
    gap: 0.55rem;
  }

  .admin-breadcrumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    align-items: center;
    color: var(--color-text-soft);
    font-size: 0.84rem;
  }

  .admin-breadcrumbs a {
    color: inherit;
  }

  .admin-breadcrumbs span::after {
    content: "/";
    margin-left: 0.55rem;
    color: rgba(16, 37, 41, 0.34);
  }

  .admin-breadcrumbs span:last-child::after {
    display: none;
  }

  .admin-header__copy h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 4vw, 3.6rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  .admin-header__copy p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.7;
    max-width: 44rem;
  }

  .admin-header__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.7rem;
  }

  .admin-header__identity {
    display: grid;
    gap: 0.2rem;
    padding: 0.85rem 0.95rem;
    border-radius: 1rem;
    border: 1px solid var(--color-border-soft);
    background: rgba(255, 255, 255, 0.54);
    min-width: 14rem;
  }

  .admin-header__identity strong {
    font-size: 0.84rem;
    color: var(--color-text-soft);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .admin-header__identity span {
    font-size: 0.96rem;
  }

  .admin-header__theme,
  .admin-header__logout,
  .admin-action-button,
  .admin-secondary-button,
  .admin-danger-button,
  .admin-form__submit,
  .admin-form__cancel {
    min-height: 2.95rem;
    padding: 0.9rem 1.15rem;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .admin-header__theme,
  .admin-secondary-button,
  .admin-form__cancel {
    border: 1px solid var(--color-border-strong);
    background: rgba(255, 255, 255, 0.58);
    color: var(--color-text);
  }

  .admin-header__logout,
  .admin-danger-button {
    background: rgba(132, 32, 50, 0.1);
    color: #8c2338;
    border: 1px solid rgba(132, 32, 50, 0.18);
  }

  .admin-action-button,
  .admin-form__submit {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: var(--color-accent-contrast);
  }

  .admin-surface {
    display: grid;
    gap: 1.15rem;
  }

  .admin-card {
    border: 1px solid var(--color-border-soft);
    border-radius: 1.35rem;
    background: rgba(248, 249, 246, 0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .admin-card__header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 1.15rem 1.2rem 0;
  }

  .admin-card__header h2,
  .admin-card__header h3 {
    margin: 0;
    font-size: 1.04rem;
  }

  .admin-card__header p {
    margin: 0.35rem 0 0;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  .admin-card__body {
    padding: 1.2rem;
  }

  .admin-grid {
    display: grid;
    gap: 1.15rem;
    grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
  }

  .admin-list-grid {
    display: grid;
    gap: 1.15rem;
  }

  .admin-toolbar {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .admin-toolbar__meta {
    color: var(--color-text-soft);
    font-size: 0.9rem;
  }

  .admin-table-wrap {
    overflow-x: auto;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
  }

  .admin-table th,
  .admin-table td {
    padding: 0.95rem 0.85rem;
    border-top: 1px solid rgba(15, 92, 99, 0.1);
    text-align: left;
    vertical-align: top;
  }

  .admin-table th {
    color: var(--color-text-soft);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .admin-table td strong {
    display: block;
    margin-bottom: 0.25rem;
  }

  .admin-table td p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.55;
  }

  .admin-table__actions {
    display: flex;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .admin-table__action {
    padding: 0.62rem 0.8rem;
    border: 1px solid var(--color-border-soft);
    background: rgba(255, 255, 255, 0.62);
    color: var(--color-text);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .admin-table__action--danger {
    border-color: rgba(132, 32, 50, 0.18);
    color: #8c2338;
    background: rgba(132, 32, 50, 0.08);
  }

  .admin-status {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.65rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .admin-status--active,
  .admin-status--published {
    background: rgba(15, 92, 99, 0.12);
    color: var(--color-accent);
  }

  .admin-status--inactive,
  .admin-status--draft {
    background: rgba(120, 126, 128, 0.12);
    color: rgba(40, 58, 61, 0.72);
  }

  .admin-form {
    display: grid;
    gap: 1rem;
  }

  .admin-form__grid {
    display: grid;
    gap: 0.95rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-form__field {
    display: grid;
    gap: 0.5rem;
  }

  .admin-form__field--full {
    grid-column: 1 / -1;
  }

  .admin-form__field label,
  .admin-form__field span {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: var(--color-text-soft);
  }

  .admin-form__field input,
  .admin-form__field select,
  .admin-form__field textarea {
    width: 100%;
    min-height: 3rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid var(--color-border-strong);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.76);
    color: var(--color-text);
  }

  .admin-form__field textarea {
    min-height: 9rem;
    resize: vertical;
  }

  .admin-form__field input[type="checkbox"] {
    width: 1.15rem;
    min-height: 1.15rem;
    padding: 0;
  }

  .admin-form__checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 3rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.54);
  }

  .admin-form__hint {
    margin: 0;
    color: var(--color-text-soft);
    font-size: 0.86rem;
    line-height: 1.55;
  }

  .admin-form__error {
    color: #8c2338;
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .admin-form__actions {
    display: flex;
    gap: 0.8rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .admin-empty {
    display: grid;
    place-items: center;
    gap: 0.55rem;
    padding: 2rem 1rem;
    text-align: center;
    color: var(--color-text-muted);
  }

  .admin-tree {
    display: grid;
    gap: 0.75rem;
  }

  .admin-tree__item {
    display: grid;
    gap: 0.7rem;
    padding: 0.95rem 1rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.58);
  }

  .admin-tree__item--depth-1 {
    margin-left: 1.2rem;
  }

  .admin-tree__item--depth-2 {
    margin-left: 2.4rem;
  }

  .admin-media-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  }

  .admin-media-card {
    display: grid;
    gap: 0.75rem;
    padding: 0.85rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.58);
  }

  .admin-media-card img {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 0.9rem;
    object-fit: cover;
    background: rgba(15, 92, 99, 0.08);
  }

  .admin-media-card__meta {
    display: grid;
    gap: 0.25rem;
  }

  .admin-media-card__meta strong {
    overflow-wrap: anywhere;
  }

  .admin-metric-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .admin-metric {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.54);
  }

  .admin-metric strong {
    font-size: 0.78rem;
    color: var(--color-text-soft);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .admin-metric span {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .admin-modal {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(6, 17, 20, 0.46);
    z-index: 20;
  }

  .admin-modal__card {
    width: min(28rem, 100%);
    display: grid;
    gap: 1rem;
    padding: 1.4rem;
    border-radius: 1.25rem;
    background: rgba(249, 250, 247, 0.96);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
  }

  .admin-modal__card h3,
  .admin-modal__card p {
    margin: 0;
  }

  .admin-upload {
    display: grid;
    gap: 0.85rem;
    padding: 0.95rem;
    border: 1px dashed var(--color-border-strong);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.52);
  }

  .admin-upload__row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .admin-upload__status {
    color: var(--color-text-soft);
    font-size: 0.88rem;
  }

  @media (max-width: 1120px) {
    .admin-shell {
      grid-template-columns: 1fr;
    }

    .admin-sidebar {
      position: static;
      height: auto;
      border-right: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .admin-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .admin-main {
      padding: 1rem 0.85rem 2rem;
    }

    .admin-header {
      padding: 1rem;
    }

    .admin-form__grid,
    .admin-metric-grid {
      grid-template-columns: 1fr;
    }

    .admin-header__actions {
      width: 100%;
      justify-content: stretch;
    }

    .admin-header__identity,
    .admin-header__theme,
    .admin-header__logout {
      width: 100%;
    }
  }
`;

export function AdminLayout({
  activeSection,
  title,
  description,
  breadcrumbs,
  theme,
  onToggleTheme,
  actions,
  children,
}: AdminLayoutProps) {
  const { admin, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  function handleLogout() {
    logout();

    if (typeof window !== "undefined") {
      window.location.assign("/admin/login/");
    }
  }

  return (
    <>
      <style>{adminLayoutStyles}</style>
      <section className="admin-shell">
        <aside
          className={
            isSidebarCollapsed
              ? "admin-sidebar admin-sidebar--collapsed"
              : "admin-sidebar"
          }
        >
          <div className="admin-sidebar__top">
            <div className="admin-sidebar__brand">
              <strong>Exxonim CMS</strong>
              <span>Protected content workspace for operations and publishing.</span>
            </div>
            <button
              className="admin-sidebar__toggle"
              type="button"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? "+" : "-"}
            </button>
          </div>

          <nav className="admin-sidebar__nav" aria-label="Admin sections">
            {adminNavItems.map((item) => (
              <a
                key={item.section}
                className={
                  item.section === activeSection
                    ? "admin-sidebar__link admin-sidebar__link--active"
                    : "admin-sidebar__link"
                }
                href={item.href}
              >
                <strong>{item.label}</strong>
                {isSidebarCollapsed ? null : <span>{item.description}</span>}
              </a>
            ))}
          </nav>
        </aside>

        <div className="admin-main">
          <header className="admin-header">
            <div className="admin-header__copy">
              <div className="admin-breadcrumbs" aria-label="Breadcrumb">
                {breadcrumbs.map((breadcrumb, index) =>
                  breadcrumb.href ? (
                    <span key={`${breadcrumb.label}-${index}`}>
                      <a href={breadcrumb.href}>{breadcrumb.label}</a>
                    </span>
                  ) : (
                    <span key={`${breadcrumb.label}-${index}`}>{breadcrumb.label}</span>
                  )
                )}
              </div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <div className="admin-header__actions">
              {actions}
              <div className="admin-header__identity">
                <strong>Authenticated Admin</strong>
                <span>{admin?.email ?? "Unknown admin"}</span>
              </div>
              <button className="admin-header__theme" onClick={onToggleTheme} type="button">
                Theme: {theme}
              </button>
              <button className="admin-header__logout" onClick={handleLogout} type="button">
                Logout
              </button>
            </div>
          </header>

          <div className="admin-surface">{children}</div>
        </div>
      </section>
    </>
  );
}

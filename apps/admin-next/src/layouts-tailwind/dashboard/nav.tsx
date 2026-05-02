import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from 'src/utils/cn';

// ----------------------------------------------------------------------

export type NavChildItem = {
  title: string;
  path: string;
  matchPrefixes?: string[];
};

export type NavItem = {
  title: string;
  path: string;
  description: string;
  icon: ReactNode;
  matchPrefixes?: string[];
  info?: ReactNode;
  children?: NavChildItem[];
};

export type NavGroup = {
  subheader: string;
  items: NavItem[];
};

export type SidebarNavProps = {
  data: NavGroup[];
  currentPath?: string;
  collapsed?: boolean;
  defaultExpanded?: string[];
  onNavigate?: (path: string) => void;
  className?: string;
};

// ----------------------------------------------------------------------
// Path matching logic
// ----------------------------------------------------------------------

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return pathname;
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function isItemActive(
  pathname: string,
  item: { path: string; matchPrefixes?: string[] }
): boolean {
  const currentPath = normalizePath(pathname);
  const prefixes = item.matchPrefixes ?? [item.path];

  return prefixes.some((prefix) => {
    const normalizedPrefix = normalizePath(prefix);
    if (normalizedPrefix === '/admin') return currentPath === '/admin';
    return currentPath === normalizedPrefix || currentPath.startsWith(`${normalizedPrefix}/`);
  });
}

function hasActiveChild(pathname: string, children?: NavChildItem[]): boolean {
  return children?.some((child) => isItemActive(pathname, child)) ?? false;
}

// ----------------------------------------------------------------------
// SidebarNav
// ----------------------------------------------------------------------

export function SidebarNav({
  data,
  currentPath = '/',
  collapsed = false,
  defaultExpanded = [],
  onNavigate,
  className,
}: SidebarNavProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    defaultExpanded.forEach((path) => {
      initial[path] = true;
    });
    return initial;
  });

  // Auto-expand parent of active item
  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      let changed = false;

      data.forEach((group) => {
        group.items.forEach((item) => {
          if (!item.children?.length) return;
          if (
            (isItemActive(currentPath, item) || hasActiveChild(currentPath, item.children)) &&
            !next[item.path]
          ) {
            next[item.path] = true;
            changed = true;
          }
        });
      });

      return changed ? next : prev;
    });
  }, [data, currentPath]);

  const toggleExpanded = useCallback((path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  }, []);

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden',
        collapsed ? 'px-3' : 'px-5',
        className
      )}
    >
      {/* Scrollable nav area */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin overflow-x-hidden">
        <div className={cn('flex flex-col', collapsed ? 'gap-3' : 'gap-5')}>
          {data.map((group) => (
            <div key={group.subheader}>
              {/* Subheader label */}
              {!collapsed && (
                <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {group.subheader}
                </div>
              )}

              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active =
                    isItemActive(currentPath, item) ||
                    hasActiveChild(currentPath, item.children);
                  const isExpanded =
                    item.children?.length
                      ? (expanded[item.path] ?? false) ||
                        hasActiveChild(currentPath, item.children)
                      : false;

                  return (
                    <li key={item.title}>
                      <NavItemButton
                        item={item}
                        active={active}
                        collapsed={collapsed}
                        isExpanded={isExpanded}
                        onToggle={() => toggleExpanded(item.path)}
                        onClick={() => onNavigate?.(item.path)}
                      />

                      {/* Child items */}
                      {!collapsed && item.children && isExpanded && (
                        <div className="pl-10 pt-1">
                          {item.children.map((child) => {
                            const childActive = isItemActive(currentPath, child);
                            return (
                              <a
                                key={child.path}
                                href={child.path}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onNavigate?.(child.path);
                                }}
                                className={cn(
                                  'flex items-center rounded-lg px-2 py-1.5 text-sm transition-colors',
                                  childActive
                                    ? 'bg-white/10 font-bold text-white'
                                    : 'text-white/60 hover:bg-white/10 hover:text-white/80'
                                )}
                              >
                                {child.title}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ----------------------------------------------------------------------
// NavItemButton
// ----------------------------------------------------------------------

type NavItemButtonProps = {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onClick: () => void;
};

function NavItemButton({
  item,
  active,
  collapsed,
  isExpanded,
  onToggle,
  onClick,
}: NavItemButtonProps) {
  const hasChildren = (item.children?.length ?? 0) > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasChildren) {
      onToggle();
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      data-active={active ? 'true' : 'false'}
      title={collapsed ? item.title : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors',
        collapsed ? 'justify-center px-0' : 'pl-2 pr-3',
        active
          ? 'bg-white/15 text-white'
          : 'text-white/70 hover:bg-white/10 hover:text-white/90'
      )}
    >
      {/* Icon */}
      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
        {item.icon}
      </span>

      {/* Label */}
      {!collapsed && (
        <span className="flex-1 truncate text-left">{item.title}</span>
      )}

      {/* Expand indicator or info badge */}
      {!collapsed && (
        <>
          {hasChildren ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                'flex-shrink-0 transition-transform',
                isExpanded ? 'rotate-180' : ''
              )}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          ) : (
            item.info
          )}
        </>
      )}
    </button>
  );
}

import type { ReactNode } from 'react';
import { cn } from 'src/utils/cn';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
};

export function DashboardLayout({
  children,
  header,
  sidebar,
  className,
}: DashboardLayoutProps) {
  return (
    <div
      className={cn(
        'flex h-screen w-full overflow-hidden',
        'bg-background-default text-text-primary',
        className
      )}
      data-layout="dashboard"
    >
      {/* Sidebar */}
      {sidebar && (
        <aside
          className={cn(
            'w-[var(--spacing-nav-width)] flex-shrink-0',
            'border-r border-divider bg-background-paper',
            'flex flex-col overflow-hidden',
            'hidden lg:flex'
          )}
        >
          {sidebar}
        </aside>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        {header && (
          <header
            className={cn(
              'flex items-center h-[var(--spacing-header-height)]',
              'px-5 border-b border-divider bg-background-paper',
              'flex-shrink-0 z-10'
            )}
          >
            {header}
          </header>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto p-[var(--spacing-content-padding)]">
          {children}
        </main>
      </div>
    </div>
  );
}

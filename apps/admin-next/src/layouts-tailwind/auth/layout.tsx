import type { ReactNode } from 'react';
import { cn } from 'src/utils/cn';

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AuthLayout({
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center',
        'bg-background-default p-4',
        className
      )}
      data-layout="auth"
    >
      <div
        className={cn(
          'w-full max-w-md',
          'bg-background-paper rounded-xl shadow-card',
          'p-8'
        )}
      >
        {children}
      </div>
    </div>
  );
}

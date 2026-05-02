import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'ghost'
  href?: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function Button({ 
  variant = 'primary', 
  href, 
  children, 
  onClick,
  className 
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-extrabold',
    'min-h-[3.65rem] px-6 py-4 rounded-full border transition-all',
    'hover:-translate-y-0.5 active:translate-y-0',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    className
  )

  const variantStyles = {
    primary: 'bg-accent text-white shadow-button hover:bg-accent-hover',
    ghost: 'bg-surface/80 text-text border-border-soft hover:bg-surface',
  }

  const classes = cn(baseStyles, variantStyles[variant])

  if (href) {
    return <a href={href} className={classes}>{children}</a>
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

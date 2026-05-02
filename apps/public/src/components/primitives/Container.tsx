import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('w-[min(1240px,calc(100%-2rem))] mx-auto', className)}>
      {children}
    </div>
  )
}

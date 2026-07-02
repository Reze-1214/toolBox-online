'use client'

import { cn } from '@/lib/utils'

/** Small dot used as a decorative accent before headings */
export function DotAccent({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'mr-2 inline-block h-1.5 w-1.5 rounded-full bg-foreground/25',
        className
      )}
      aria-hidden="true"
    />
  )
}

/** A thin decorative divider with a centered dot */
export function DotDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 py-2', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="h-1 w-1 rounded-full bg-border" />
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

/** A thin decorative divider with a centered diamond */
export function DiamondDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 py-2', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="h-1.5 w-1.5 rotate-45 rounded-[1px] border border-border bg-background" />
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

/** Decorative row of small dots */
export function DotRow({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-1.5', className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1 w-1 rounded-full bg-border',
            i === Math.floor(count / 2) && 'bg-muted-foreground/30'
          )}
        />
      ))}
    </div>
  )
}

/** Subtle background dot grid pattern */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-40',
        className
      )}
      aria-hidden="true"
      style={{
        backgroundImage: 'radial-gradient(circle, currentColor 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px',
      }}
    />
  )
}

/** Small decorative corner brackets */
export function CornerBrackets({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none relative', className)} aria-hidden="true">
      <span className="absolute -left-1 -top-1 h-3 w-3 border-l border-t border-border" />
      <span className="absolute -right-1 -top-1 h-3 w-3 border-r border-t border-border" />
      <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-border" />
      <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-border" />
    </div>
  )
}

/** A small label/badge with decorative styling */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="h-px w-4 bg-border" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {children}
      </span>
      <span className="h-px w-4 bg-border" />
    </div>
  )
}

/** Decorative icon container with subtle ring */
export function DecorativeIconBox({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dotted' | 'ringed'
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        variant === 'default' && 'h-10 w-10 rounded-sm border bg-background text-muted-foreground',
        variant === 'dotted' && 'h-10 w-10 rounded-sm border border-dashed bg-background text-muted-foreground',
        variant === 'ringed' && 'h-10 w-10 rounded-full border-2 border-dashed text-muted-foreground/60',
        className
      )}
    >
      {children}
    </div>
  )
}

/** Empty state with visual illustration */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <div className="relative mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed text-muted-foreground/40">
          <Icon className="h-6 w-6" />
        </div>
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-border" />
        <span className="absolute -bottom-0.5 -left-1 h-1.5 w-1.5 rounded-full bg-border" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-center text-xs text-muted-foreground/70">{description}</p>
      )}
    </div>
  )
}

/** Subtle decorative line pattern for section backgrounds */
export function LinePattern({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden opacity-30', className)}
      aria-hidden="true"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 23px, currentColor 23px, currentColor 24px)',
        backgroundSize: '100% 24px',
      }}
    />
  )
}
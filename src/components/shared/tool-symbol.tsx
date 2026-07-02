'use client'

import { cn } from '@/lib/utils'

// Each tool/category gets a short monospace label instead of a generic icon
const symbolMap: Record<string, string> = {
  // Tools
  'qr-generator': 'QR',
  'password-generator': 'pw',
  'json-formatter': '{}',
  'uuid-generator': '#4',
  'word-counter': 'wc',
  'image-compressor': 'img',
  'base64-encoder': 'b64',
  'timestamp-converter': 'ts',
  // Categories
  'text-tools': 'T',
  'image-tools': 'I',
  'developer-tools': '</>',
  'converter-tools': '⇄',
}

export function ToolSymbol({ slug, className, size = 'sm' }: { slug: string; className?: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const symbol = symbolMap[slug] || slug.slice(0, 3)

  const sizeClasses = {
    xs: 'text-[10px] leading-none',
    sm: 'text-xs leading-none',
    md: 'text-sm leading-none',
    lg: 'text-base leading-none',
  }

  return (
    <span
      className={cn(
        'font-mono font-medium tracking-tight text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {symbol}
    </span>
  )
}

export function getToolSymbol(slug: string): string {
  return symbolMap[slug] || slug.slice(0, 3)
}
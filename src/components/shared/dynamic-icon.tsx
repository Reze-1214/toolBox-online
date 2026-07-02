'use client'

import { createElement } from 'react'
import { getIcon } from '@/lib/icons'

export function DynamicIcon({ name, className, strokeWidth = 1.5 }: { name: string; className?: string; strokeWidth?: number }) {
  const Icon = getIcon(name)
  return createElement(Icon, { className, strokeWidth })
}
'use client'

import { useNavigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { ToolSymbol } from '@/components/shared/tool-symbol'
import { useLocale } from '@/lib/i18n/locale-store'
import { getCategoryName, getCategoryDescription } from '@/lib/i18n/translations'
import { ArrowRight } from 'lucide-react'

export interface CategoryData {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
  _count?: { tools: number }
}

interface CategoryCardProps {
  category: CategoryData
  compact?: boolean
}

export function CategoryCard({ category, compact = false }: CategoryCardProps) {
  const { navigate } = useNavigation()
  const { locale } = useLocale()

  return (
    <button
      onClick={() => navigate({ type: 'tools', categoryId: category.slug })}
      className={cn(
        'group flex items-center gap-3 rounded-sm border p-3 text-left transition-colors hover:border-foreground/20',
        compact && 'p-2.5 gap-2.5'
      )}
    >
      <ToolSymbol slug={category.slug} className="shrink-0 w-5 text-center" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{getCategoryName(category.slug, locale)}</span>
          <div className="flex items-center gap-2">
            {category._count && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {category._count.tools}
              </span>
            )}
            <ArrowRight className="h-3 w-3 text-muted-foreground/20 transition-opacity group-hover:opacity-60" />
          </div>
        </div>
        {!compact && category.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {getCategoryDescription(category.slug, locale)}
          </p>
        )}
      </div>
    </button>
  )
}
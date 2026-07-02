'use client'

import { useNavigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { ToolSymbol } from '@/components/shared/tool-symbol'
import { useLocale } from '@/lib/i18n/locale-store'
import { getCategoryName, getCategoryDescription } from '@/lib/i18n/translations'
import { ArrowRight } from 'lucide-react'

const INK = '#202B26'

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
        'group relative flex items-center gap-3 overflow-hidden border-2 bg-white p-3 text-left transition-all hover:-translate-y-0.5 sm:p-4',
        compact && 'gap-2.5 p-2.5'
      )}
      style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
    >
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: '#E8A33D' }} aria-hidden="true" />
      <div className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-none border-2" style={{ borderColor: INK, backgroundColor: '#FBEBD3' }}>
        <ToolSymbol slug={category.slug} className="w-4 text-center" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>
            {getCategoryName(category.slug, locale)}
          </span>
          <div className="flex items-center gap-2">
            {category._count && (
              <span className="font-mono text-xs tabular-nums" style={{ color: `${INK}CC` }}>
                {category._count.tools}
              </span>
            )}
            <ArrowRight className="h-3 w-3 transition-opacity group-hover:opacity-70" style={{ color: INK }} />
          </div>
        </div>
        {!compact && category.description && (
          <p className="mt-1 line-clamp-1 text-xs" style={{ color: `${INK}CC` }}>
            {getCategoryDescription(category.slug, locale)}
          </p>
        )}
      </div>
    </button>
  )
}
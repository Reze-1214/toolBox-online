'use client'

import { useState } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useAuth } from '@/lib/auth'
import { useMutation } from '@tanstack/react-query'
import { Heart, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolSymbol } from '@/components/shared/tool-symbol'
import { useT } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n/locale-store'
import { getToolName, getToolDescription } from '@/lib/i18n/translations'

export interface ToolData {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  categoryId: string
  isPopular: boolean
  order: number
  category?: { name: string; slug: string }
  isFavorite?: boolean
}

interface ToolCardProps {
  tool: ToolData
  compact?: boolean
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  const { navigate } = useNavigation()
  const { user } = useAuth()
  const { t } = useT()
  const { locale } = useLocale()
  const [isFav, setIsFav] = useState(tool.isFavorite || false)

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (!user) return
      const res = await fetch('/api/favorites', {
        method: isFav ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id }),
      })
      if (!res.ok) throw new Error()
    },
    onSuccess: () => setIsFav(!isFav),
  })

  return (
    <button
      onClick={() => navigate({ type: 'tool', slug: tool.slug })}
      className={cn(
        'group flex w-full items-start gap-3 rounded-sm border border-transparent p-3 text-left transition-colors hover:border-border',
        compact && 'p-2 gap-2.5'
      )}
    >
      <ToolSymbol slug={tool.slug} className="mt-0.5 shrink-0 w-5 text-center" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {getToolName(tool.slug, locale)}
          </span>
          <ArrowRight className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-30" />
        </div>
        {!compact && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {getToolDescription(tool.slug, locale)}
          </p>
        )}
      </div>
      {user && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFav.mutate()
          }}
          className="shrink-0 p-1 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground hover:!text-foreground"
          aria-label={t(isFav ? 'tool.removeFromFavorites' : 'tool.addToFavorites')}
        >
          <Heart
            className="h-3.5 w-3.5"
            fill={isFav ? 'currentColor' : 'none'}
          />
        </button>
      )}
    </button>
  )
}
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

const INK = '#202B26'
const ACCENTS = [
  { solid: '#E8A33D', tint: '#FBEBD3' },
  { solid: '#C1502E', tint: '#F5DCD3' },
  { solid: '#3E6990', tint: '#DCE6ED' },
  { solid: '#6B8F71', tint: '#DEE8DE' },
  { solid: '#7C4A6B', tint: '#E9DCE4' },
]

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
  const accent = ACCENTS[(tool.slug.length + tool.slug.charCodeAt(0)) % ACCENTS.length]

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
    <div className="group relative flex w-full items-start gap-3 overflow-hidden border-2 bg-white p-3 text-left transition-all hover:-translate-y-0.5 sm:p-4" style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}>
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: accent.solid }} aria-hidden="true" />
      <div className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-none border-2" style={{ borderColor: INK, backgroundColor: accent.tint }}>
        <ToolSymbol slug={tool.slug} className="w-4 text-center" />
      </div>
      <button
        onClick={() => navigate({ type: 'tool', slug: tool.slug })}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>
            {getToolName(tool.slug, locale)}
          </span>
          <ArrowRight className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-30" style={{ color: INK }} />
        </div>
        {!compact && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: `${INK}CC` }}>
            {getToolDescription(tool.slug, locale)}
          </p>
        )}
      </button>
      {user && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFav.mutate()
          }}
          className="shrink-0 rounded-none border-2 p-1 transition-colors hover:-translate-y-0.5"
          style={{ borderColor: INK, color: INK, backgroundColor: '#fff' }}
          aria-label={t(isFav ? 'tool.removeFromFavorites' : 'tool.addToFavorites')}
        >
          <Heart className="h-3.5 w-3.5" fill={isFav ? 'currentColor' : 'none'} />
        </button>
      )}
    </div>
  )
}
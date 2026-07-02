'use client'

import { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useAuth } from '@/lib/auth'
import { useT } from '@/lib/i18n'
import { getToolName, getToolDescription, getCategoryName } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { ToolSymbol } from '@/components/shared/tool-symbol'
import { Heart, ArrowLeft } from 'lucide-react'

const INK = '#202B26'
const BOARD = '#E4E7E2'
const ACCENT = '#E8A33D'
import { useMutation } from '@tanstack/react-query'
import { dynamicImportTool } from '@/lib/tool-registry'
import type { ComponentType } from 'react'

interface ToolInfo {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  isPopular: boolean
  category: { name: string; slug: string }
  isFavorite?: boolean
}

export function ToolPage({ slug }: { slug: string }) {
  const { navigate } = useNavigation()
  const { user } = useAuth()
  const { t, locale } = useT()
  const [tool, setTool] = useState<ToolInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [ToolComponent, setToolComponent] = useState<ComponentType | null>(null)
  const [toolNotImplemented, setToolNotImplemented] = useState(false)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    fetch(`/api/tools?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const toolData = data[0]
          setTool(toolData)
          setIsFav(toolData.isFavorite || false)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!tool) return
    const comp = dynamicImportTool(tool.slug)
    if (comp) {
      comp.then((m) => setToolComponent(() => m.default)).catch(() => {
        queueMicrotask(() => setToolNotImplemented(true))
      })
    } else {
      queueMicrotask(() => setToolNotImplemented(true))
    }
    if (user) {
      fetch(`/api/recently-used`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id }),
      }).catch(() => {})
    }
  }, [tool, user, slug])

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (!user || !tool) return
      const res = await fetch('/api/favorites', {
        method: isFav ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id }),
      })
      if (!res.ok) throw new Error()
    },
    onSuccess: () => setIsFav(!isFav),
  })

  if (loading) {
    return (
      <div className="pb-12" style={{ backgroundColor: BOARD }}>
        <div className="h-3 w-6 animate-pulse rounded-none border-2 bg-white" style={{ borderColor: INK }} />
        <div className="mt-2 h-5 w-48 animate-pulse rounded-none border-2 bg-white" style={{ borderColor: INK }} />
        <div className="mt-2 h-3 w-64 animate-pulse rounded-none border-2 bg-white" style={{ borderColor: INK }} />
        <div className="mt-6 h-64 animate-pulse rounded-none border-2 bg-white" style={{ borderColor: INK }} />
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="pb-12" style={{ backgroundColor: BOARD }}>
        <button
          onClick={() => navigate({ type: 'tools' })}
          className="mb-4 flex items-center gap-1.5 rounded-none border-2 bg-white px-3 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ borderColor: INK, color: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('shared.backToTools')}
        </button>
        <p className="text-sm" style={{ color: `${INK}CC` }}>{t('tool.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="pb-12" style={{ backgroundColor: BOARD }}>
      <button
        onClick={() => navigate({ type: 'tools' })}
        className="mb-4 flex items-center gap-1.5 rounded-none border-2 bg-white px-3 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{ borderColor: INK, color: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('tool.back')}
      </button>

      <div className="rounded-none border-2 bg-white p-4 sm:p-5" style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none border-2" style={{ borderColor: INK, backgroundColor: '#FBEBD3' }}>
              <ToolSymbol slug={tool.slug} size="md" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-[0.12em] sm:text-xl" style={{ color: INK }}>
                {getToolName(tool.slug, locale)}
              </h1>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: `${INK}CC` }}>
                {getToolDescription(tool.slug, locale)}
              </p>
              <span className="mt-2 inline-block rounded-none border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: INK, color: INK, backgroundColor: '#FBEBD3' }}>
                {getCategoryName(tool.category.slug, locale)}
              </span>
            </div>
          </div>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFav.mutate()}
              className="h-10 shrink-0 rounded-none border-2 px-3 text-sm"
              style={{ borderColor: INK, color: INK, backgroundColor: '#fff', boxShadow: `2px 2px 0 0 ${INK}` }}
            >
              <Heart
                className="mr-1.5 h-3.5 w-3.5"
                fill={isFav ? 'currentColor' : 'none'}
              />
              {isFav ? t('tool.saved') : t('tool.save')}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-none border-2 bg-white" style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
        {ToolComponent ? (
          <ToolComponent />
        ) : toolNotImplemented ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="font-mono text-2xl" style={{ color: `${INK}20` }}>—</span>
            <p className="mt-2 text-sm" style={{ color: `${INK}CC` }}>
              {t('tool.notImplemented') || 'Tool coming soon.'}
            </p>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center">
            <span className="font-mono text-xs animate-pulse" style={{ color: `${INK}60` }}>loading...</span>
          </div>
        )}
      </div>
    </div>
  )
}
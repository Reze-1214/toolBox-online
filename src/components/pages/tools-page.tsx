'use client'

import { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useT } from '@/lib/i18n'
import { getToolName, getToolDescription, getCategoryName } from '@/lib/i18n/translations'
import { ToolCard, type ToolData } from '@/components/shared/tool-card'
import { CategoryCard, type CategoryData } from '@/components/shared/category-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { EmptyState } from '@/components/shared/decorations'

const INK = '#202B26'
const BOARD = '#E4E7E2'

export function ToolsPage({ categoryId }: { categoryId?: string }) {
  const { navigate } = useNavigation()
  const { t, locale } = useT()
  const [tools, setTools] = useState<ToolData[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryId || null)
  const [showCategories, setShowCategories] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/tools${categoryId ? `?category=${categoryId}` : ''}`).then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ]).then(([toolsData, catsData]) => {
      setTools(toolsData)
      setCategories(catsData)
      setLoading(false)
    })
  }, [categoryId])

  const filtered = tools.filter((tool) => {
    if (activeCategory) {
      const cat = categories.find((c) => c.id === activeCategory || c.slug === activeCategory)
      if (cat && tool.categoryId !== cat.id) return false
    }
    const toolName = getToolName(tool.slug, locale)
    const toolDesc = getToolDescription(tool.slug, locale)
    if (search && !toolName.toLowerCase().includes(search.toLowerCase()) && !toolDesc.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  const activeCatName = activeCategory
    ? getCategoryName(categories.find((c) => c.slug === activeCategory || c.id === activeCategory)?.slug || activeCategory, locale)
    : null

  return (
    <div className="pb-12" style={{ backgroundColor: BOARD }}>
      <div className="mb-6 rounded-none border-2 bg-white p-4 sm:p-6" style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: `${INK}CC` }}>
          {activeCatName ? 'filtered' : 'catalog'}
        </p>
        <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl" style={{ color: INK }}>
          {activeCatName || t('tools.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: `${INK}CC` }}>
          {activeCatName ? t('tools.filtered', { category: activeCatName }) : t('tools.subtitle')}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-none border-2 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4" style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: INK }} />
          <Input
            placeholder={t('tools.filter')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-none border-2 pl-8 text-sm"
            style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: INK }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setActiveCategory(null); if (categoryId) navigate({ type: 'tools' }) }}
              className="h-10 rounded-none border-2 text-xs"
              style={{ borderColor: INK, color: INK, backgroundColor: '#fff' }}
            >
              {t('tools.clearFilter')}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategories(!showCategories)}
            className="h-10 rounded-none border-2 text-xs"
            style={{ borderColor: INK, color: INK, backgroundColor: '#fff', boxShadow: `2px 2px 0 0 ${INK}` }}
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            {t('tools.categories')}
          </Button>
        </div>
      </div>

      {showCategories && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                setShowCategories(false)
              }}
              className="flex items-center gap-3 rounded-none border-2 bg-white p-3 text-left transition-all hover:-translate-y-0.5"
              style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
            >
              <span className="font-mono text-xs" style={{ color: `${INK}CC` }}>
                {getCategoryName(cat.slug, locale).charAt(0)}
              </span>
              <span className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>
                {getCategoryName(cat.slug, locale)}
              </span>
              <span className="ml-auto font-mono text-xs tabular-nums" style={{ color: `${INK}CC` }}>
                {cat._count?.tools || 0}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-2">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-none border-2" style={{ borderColor: `${INK}33`, backgroundColor: '#fff' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title={t('tools.empty.title') || t('tools.noTools')}
            description={t('tools.empty.desc')}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
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
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {activeCatName || t('tools.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCatName ? t('tools.filtered', { category: activeCatName }) : t('tools.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('tools.filter')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 rounded-sm border pl-8 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setActiveCategory(null); if (categoryId) navigate({ type: 'tools' }) }}
              className="h-8 rounded-sm text-xs"
            >
              {t('tools.clearFilter')}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategories(!showCategories)}
            className="h-8 rounded-sm text-xs"
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            {t('tools.categories')}
          </Button>
        </div>
      </div>

      {showCategories && (
        <div className="mt-3 grid gap-px overflow-hidden rounded-sm border sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                setShowCategories(false)
              }}
              className={`flex items-center gap-3 bg-background p-3 text-left transition-colors hover:bg-secondary/50 ${
                activeCategory === cat.slug ? 'bg-secondary' : ''
              }`}
            >
              <span className="font-mono text-xs text-muted-foreground">{getCategoryName(cat.slug, locale).charAt(0)}</span>
              <span className="text-sm font-medium">{getCategoryName(cat.slug, locale)}</span>
              <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
                {cat._count?.tools || 0}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-sm bg-secondary/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title={t('tools.empty.title') || t('tools.noTools')}
            description={t('tools.empty.desc')}
          />
        ) : (
          <div className="grid gap-px overflow-hidden rounded-sm border sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useT } from '@/lib/i18n'
import { getToolName, getToolDescription, getCategoryName } from '@/lib/i18n/translations'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { ToolSymbol } from '@/components/shared/tool-symbol'

interface SearchResult {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  category: { name: string; slug: string }
}

export function SearchPage({ initialQuery }: { initialQuery?: string }) {
  const { navigate } = useNavigation()
  const { t, locale } = useT()
  const [query, setQuery] = useState(initialQuery || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } catch {
      setResults([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (initialQuery) {
      queueMicrotask(() => doSearch(initialQuery))
    }
  }, [initialQuery, doSearch])

  return (
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('search.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('search.subtitle')}</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); doSearch(query) }}
        className="relative max-w-lg"
      >
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          type="search"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 rounded-sm border pl-9 pr-9 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-sm bg-secondary/40" />
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs text-muted-foreground/50 mb-2">—</p>
            <p className="text-sm text-muted-foreground">
              {t('search.noResults', { query })}
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-px overflow-hidden rounded-sm border sm:grid-cols-2">
            {results.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigate({ type: 'tool', slug: tool.slug })}
                className="group flex items-start gap-3 bg-background p-3.5 text-left transition-colors hover:bg-secondary/50"
              >
                <ToolSymbol slug={tool.slug} className="mt-0.5 shrink-0 w-5 text-center" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{getToolName(tool.slug, locale)}</span>
                  </div>
                  <span className="mt-0.5 inline-block font-mono text-[10px] text-muted-foreground/60">
                    {getCategoryName(tool.category.slug, locale)}
                  </span>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {getToolDescription(tool.slug, locale)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : !searched ? (
          <div className="py-16 text-center">
            <p className="font-mono text-lg text-muted-foreground/20 mb-2">?</p>
            <p className="text-sm text-muted-foreground">{t('search.subtitle')}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
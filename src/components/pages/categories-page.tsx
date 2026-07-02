'use client'

import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { CategoryCard, type CategoryData } from '@/components/shared/category-card'

export function CategoriesPage() {
  const { t } = useT()
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories?withCounts=true')
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('categories.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('categories.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-sm bg-secondary/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-sm border sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  )
}
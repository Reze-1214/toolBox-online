'use client'

import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { CategoryCard, type CategoryData } from '@/components/shared/category-card'

const INK = '#202B26'
const BOARD = '#E4E7E2'

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
    <div className="pb-12" style={{ backgroundColor: BOARD }}>
      <div className="mb-6 rounded-none border-2 bg-white p-4 sm:p-6" style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: `${INK}CC` }}>
          browse
        </p>
        <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl" style={{ color: INK }}>
          {t('categories.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: `${INK}CC` }}>
          {t('categories.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-none border-2 bg-white" style={{ borderColor: `${INK}33` }} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  )
}
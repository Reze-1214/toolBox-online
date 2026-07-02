'use client'

import { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useT } from '@/lib/i18n'
import { getToolName, getToolDescription, getCategoryName, getCategoryDescription } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ToolSymbol } from '@/components/shared/tool-symbol'

export function HomePage() {
  const { navigate } = useNavigation()
  const { t, locale } = useT()

  return (
    <div className="space-y-16 pb-12 sm:space-y-24 sm:pb-16">
      {/* Hero */}
      <HeroSection />

      {/* Tools Grid */}
      <AllToolsSection />

      {/* Categories */}
      <CategoriesSection />
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────────────── */

function HeroSection() {
  const { navigate } = useNavigation()
  const { t } = useT()

  return (
    <section className="relative py-6 sm:py-10 lg:py-14">
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_auto]">
        {/* Left: text */}
        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase sm:text-sm">
            toolbox
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight leading-[1.15] sm:text-4xl lg:text-5xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
            {t('home.hero.description')}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button
              onClick={() => navigate({ type: 'tools' })}
              variant="default"
              className="h-9 rounded-sm px-5 text-sm"
            >
              {t('home.explore')}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {t('stats.tools.desc')}
            </span>
          </div>
        </div>

        {/* Right: decorative tool preview */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Stacked card previews */}
            <div className="space-y-2">
              {['json-formatter', 'password-generator', 'qr-generator'].map((slug, i) => (
                <div
                  key={slug}
                  className="flex items-center gap-3 rounded-sm border bg-background px-4 py-3"
                  style={{ width: 220 + i * 16, marginLeft: i * 16 }}
                >
                  <ToolSymbol slug={slug} className="w-6 text-center text-[11px]" />
                  <span className="text-xs font-medium text-foreground truncate">
                    {slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              ))}
            </div>
            {/* Decorative elements */}
            <span className="absolute -left-6 top-0 h-8 w-px bg-border" aria-hidden="true" />
            <span className="absolute -right-4 bottom-0 h-8 w-px bg-border" aria-hidden="true" />
            <span className="absolute -top-3 right-8 h-1.5 w-1.5 rotate-45 border border-border" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Bottom stat bar */}
      <div className="mt-10 flex items-center gap-6 border-t pt-6 sm:mt-14 sm:gap-10 sm:pt-8">
        {[
          { value: '8', label: t('stats.tools') },
          { value: '0ms', label: t('stats.fast') },
          { value: '∞', label: t('stats.free') },
        ].map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold tabular-nums sm:text-xl">{item.value}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── All Tools ────────────────────────────────────────── */

function AllToolsSection() {
  const { navigate } = useNavigation()
  const { t, locale } = useT()
  const [tools, setTools] = useState<Array<{
    id: string; name: string; slug: string; description: string; icon: string | null; isPopular: boolean
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tools')
      .then((r) => r.json())
      .then((data) => { setTools(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <SectionHeading title={t('home.popular.title')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-sm bg-secondary/40" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <SectionHeading title={t('home.popular.title')} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => navigate({ type: 'tool', slug: tool.slug })}
            className="group relative flex items-start gap-3 rounded-sm border p-4 text-left transition-colors hover:border-foreground/20"
          >
            <ToolSymbol slug={tool.slug} className="mt-0.5 shrink-0 w-5 text-center" />
            <div className="min-w-0">
              <span className="text-sm font-medium">{getToolName(tool.slug, locale)}</span>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {getToolDescription(tool.slug, locale)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ─── Categories ───────────────────────────────────────── */

function CategoriesSection() {
  const { navigate } = useNavigation()
  const { t, locale } = useT()
  const [categories, setCategories] = useState<Array<{
    id: string; name: string; slug: string; description: string | null; icon: string | null; _count: { tools: number }
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <SectionHeading title={t('home.categories.title')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-sm bg-secondary/40" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <SectionHeading title={t('home.categories.title')} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate({ type: 'tools', categoryId: cat.slug })}
            className="group flex items-baseline justify-between rounded-sm border px-4 py-3.5 text-left transition-colors hover:border-foreground/20"
          >
            <div>
              <span className="text-sm font-medium">{getCategoryName(cat.slug, locale)}</span>
              {cat.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {getCategoryDescription(cat.slug, locale)}
                </p>
              )}
            </div>
            <span className="shrink-0 ml-3 font-mono text-xs tabular-nums text-muted-foreground">
              {cat._count.tools}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ─── Shared ───────────────────────────────────────────── */

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
      <span className="hidden h-px flex-1 bg-border ml-4 sm:block" />
    </div>
  )
}
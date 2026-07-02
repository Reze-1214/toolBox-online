'use client'

import { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useT } from '@/lib/i18n'
import { getToolName, getToolDescription, getCategoryName, getCategoryDescription } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ToolSymbol } from '@/components/shared/tool-symbol'

/* ─── Design tokens ────────────────────────────────────────
   Pegboard workshop palette — deliberately not the cream+serif
   or dark+neon defaults. Cool slate "pegboard" base, ink text,
   and a rotating set of craft-tray accent colors per card.
──────────────────────────────────────────────────────────── */
const INK = '#202B26'
const BOARD = '#E4E7E2'
const ACCENTS = [
  { name: 'amber', solid: '#E8A33D', tint: '#FBEBD3' },
  { name: 'brick', solid: '#C1502E', tint: '#F5DCD3' },
  { name: 'denim', solid: '#3E6990', tint: '#DCE6ED' },
  { name: 'olive', solid: '#6B8F71', tint: '#DEE8DE' },
  { name: 'plum', solid: '#7C4A6B', tint: '#E9DCE4' },
]
// deterministic "hand-placed" tilt per index, so it's stable across renders
const TILTS = [-1.6, 1.1, -0.6, 2.1, -2.2, 0.7, 1.7, -1.1, 0.4, -1.9, 1.4, -0.3]

export function HomePage() {
  return (
    <div
      className="space-y-12 pb-10 sm:space-y-24 sm:pb-16"
      style={{
        backgroundColor: BOARD,
        backgroundImage: `radial-gradient(circle, rgba(32,43,38,0.14) 1px, transparent 1.3px)`,
        backgroundSize: '18px 18px',
      }}
    >
      <HeroSection />
      <AllToolsSection />
      <CategoriesSection />
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────────────── */

function HeroSection() {
  const { navigate } = useNavigation()
  const { t } = useT()

  return (
    <section className="relative overflow-hidden px-3 pt-8 pb-6 sm:px-8 sm:pt-16 sm:pb-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        {/* Left: text */}
        <div className="relative">
          {/* hand-inked eyebrow, taped-on look */}
          <span
            className="inline-block -rotate-2 border-2 px-3 py-1 font-mono text-[11px] font-bold tracking-widest uppercase"
            style={{ borderColor: INK, color: INK, backgroundColor: '#fff' }}
          >
            the toolbox
          </span>

          <h1
            className="mt-5 text-3xl leading-[0.95] font-black tracking-tight sm:text-6xl lg:text-7xl"
            style={{ color: INK, fontFamily: '"Archivo Black", "Arial Black", sans-serif' }}
          >
            {t('home.hero.title')}
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: `${INK}CC` }}>
            {t('home.hero.description')}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              onClick={() => navigate({ type: 'tools' })}
              className="h-11 w-full justify-center rounded-none border-2 px-6 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0_0_rgba(32,43,38,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(32,43,38,1)] active:translate-y-0 active:shadow-[1px_1px_0_0_rgba(32,43,38,1)] sm:w-auto"
              style={{ backgroundColor: '#E8A33D', borderColor: INK, color: INK }}
            >
              {t('home.explore')}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium" style={{ color: `${INK}99` }}>
              {t('stats.tools.desc')}
            </span>
          </div>
        </div>

        {/* Right: pegboard hooks with tools "hanging" */}
        <div className="hidden lg:block">
          <div className="relative w-[280px]">
            {['json-formatter', 'password-generator', 'qr-generator'].map((slug, i) => {
              const accent = ACCENTS[i % ACCENTS.length]
              return (
                <div
                  key={slug}
                  className="relative mb-3 flex items-center gap-3 border-2 bg-white px-4 py-3 last:mb-0"
                  style={{
                    borderColor: INK,
                    transform: `rotate(${TILTS[i]}deg) translateX(${i * 10}px)`,
                    boxShadow: `3px 3px 0 0 ${INK}`,
                  }}
                >
                  {/* punched hole */}
                  <span
                    className="absolute -top-2.5 left-5 h-3 w-3 rounded-full border-2"
                    style={{ borderColor: INK, backgroundColor: BOARD }}
                  />
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: accent.tint, color: accent.solid }}
                  >
                    <ToolSymbol slug={slug} className="w-4 text-center" />
                  </span>
                  <span className="truncate text-xs font-bold" style={{ color: INK }}>
                    {slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              )
            })}
            {/* pegboard hook pins */}
            {[40, 130, 220].map((top, i) => (
              <span
                key={i}
                className="absolute -left-3 h-2 w-2 rounded-full"
                style={{ top, backgroundColor: INK }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stat strip — measuring-tape ticks */}
      <div className="relative mt-10 flex flex-col gap-2 border-t-2 sm:mt-14 sm:flex-row sm:gap-0" style={{ borderColor: INK }}>
        {[
          { value: '8', label: t('stats.tools') },
          { value: '0ms', label: t('stats.fast') },
          { value: '∞', label: t('stats.free') },
        ].map((item, i) => (
          <div
            key={item.label}
            className="flex flex-1 items-baseline gap-2 border-b-2 border-r-0 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0 sm:px-6"
            style={{ borderColor: i < 2 ? `${INK}33` : 'transparent' }}
          >
            <span
              className="text-xl font-black tabular-nums sm:text-2xl"
              style={{ color: ACCENTS[i % ACCENTS.length].solid }}
            >
              {item.value}
            </span>
            <span className="text-xs font-medium" style={{ color: `${INK}99` }}>
              {item.label}
            </span>
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
      <section className="px-3 sm:px-8">
        <SectionHeading title={t('home.popular.title')} />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse border-2 border-dashed" style={{ borderColor: `${INK}33` }} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="px-3 sm:px-8">
      <SectionHeading title={t('home.popular.title')} />
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
        {tools.map((tool, i) => {
          const accent = ACCENTS[i % ACCENTS.length]
          const tilt = TILTS[i % TILTS.length]
          return (
            <button
              key={tool.id}
              onClick={() => navigate({ type: 'tool', slug: tool.slug })}
              className="group relative flex min-h-[96px] items-start gap-3 border-2 bg-white p-3 text-left transition-transform duration-150 hover:-translate-y-1 active:translate-y-0 sm:p-4"
              style={{
                borderColor: INK,
                transform: `rotate(${tilt}deg)`,
                boxShadow: `3px 3px 0 0 ${INK}`,
              }}
            >
              {/* punched hang-tag hole */}
              <span
                className="absolute -top-2.5 left-5 h-3 w-3 rounded-full border-2"
                style={{ borderColor: INK, backgroundColor: '#fff' }}
              />
              {tool.isPopular && (
                <span
                  className="absolute -top-3 -right-2 -rotate-6 border-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{ borderColor: INK, backgroundColor: accent.solid, color: '#fff' }}
                >
                  {t('stats.tools.desc') ? '★' : '★'}
                </span>
              )}
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: accent.tint, color: accent.solid }}
              >
                <ToolSymbol slug={tool.slug} className="w-5 text-center" />
              </span>
              <div className="min-w-0">
                <span className="text-sm font-bold" style={{ color: INK }}>
                  {getToolName(tool.slug, locale)}
                </span>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: `${INK}99` }}>
                  {getToolDescription(tool.slug, locale)}
                </p>
              </div>
            </button>
          )
        })}
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
      <section className="px-3 sm:px-8">
        <SectionHeading title={t('home.categories.title')} />
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse border-2 border-dashed" style={{ borderColor: `${INK}33` }} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="px-3 sm:px-8">
      <SectionHeading title={t('home.categories.title')} />
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {categories.map((cat, i) => {
          const accent = ACCENTS[(i + 2) % ACCENTS.length]
          return (
            <button
              key={cat.id}
              onClick={() => navigate({ type: 'tools', categoryId: cat.slug })}
              className="group relative flex items-center justify-between overflow-hidden border-2 bg-white px-3 py-3 text-left transition-colors sm:px-4 sm:py-4"
              style={{ borderColor: INK }}
            >
              {/* drawer-front accent stripe */}
              <span
                className="absolute inset-y-0 left-0 w-1.5 transition-all group-hover:w-2.5"
                style={{ backgroundColor: accent.solid }}
                aria-hidden="true"
              />
              <div className="pl-2">
                <span className="text-sm font-bold" style={{ color: INK }}>
                  {getCategoryName(cat.slug, locale)}
                </span>
                {cat.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs" style={{ color: `${INK}99` }}>
                    {getCategoryDescription(cat.slug, locale)}
                  </p>
                )}
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-bold tabular-nums"
                style={{ backgroundColor: accent.tint, color: accent.solid }}
              >
                {cat._count.tools}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ─── Shared ───────────────────────────────────────────── */

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 sm:mb-6">
      <h2 className="text-xl font-black tracking-tight sm:text-2xl" style={{ color: INK }}>
        {title}
      </h2>
      <span className="h-2 flex-1 opacity-70" style={{
        backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 6px, transparent 6px 12px)`,
        height: 2,
      }} />
    </div>
  )
}
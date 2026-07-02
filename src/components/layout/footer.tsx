'use client'

import { useT } from '@/lib/i18n'

const INK = '#202B26'
const BOARD = '#E4E7E2'

export function Footer() {
  const { t } = useT()

  return (
    <footer className="mt-auto border-t-2" style={{ borderColor: INK, backgroundColor: BOARD }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span
            className="rounded-none border-2 bg-white px-2.5 py-1 font-mono text-[11px] font-black uppercase tracking-[0.25em]"
            style={{ borderColor: INK, color: INK }}
          >
            toolbox
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: `${INK}CC` }}>
            fast tools · no clutter
          </span>
        </div>
        <span className="text-[11px] sm:text-xs" style={{ color: `${INK}CC` }}>
          {t('footer.noTracking')} · {t('footer.noAds')} · {t('footer.openSource')}
        </span>
      </div>
    </footer>
  )
}

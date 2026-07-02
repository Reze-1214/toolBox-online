'use client'

import { useT } from '@/lib/i18n'

export function Footer() {
  const { t } = useT()

  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-muted-foreground sm:px-6">
        <span className="font-mono">toolbox</span>
        <span>
          {t('footer.noTracking')} · {t('footer.noAds')} · {t('footer.openSource')}
        </span>
      </div>
    </footer>
  )
}
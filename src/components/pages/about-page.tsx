'use client'

import { useT } from '@/lib/i18n'

export function AboutPage() {
  const { t } = useT()

  return (
    <div className="pb-12">
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">about</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('about.title')}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t('about.description')}
        </p>
      </div>

      <div className="max-w-2xl space-y-10">
        {/* Why */}
        <section>
          <h2 className="text-base font-semibold tracking-tight">{t('about.why.title')}</h2>
          <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <p>{t('about.why.p1')}</p>
            <p>{t('about.why.p2')}</p>
          </div>
        </section>

        <div className="border-t" />

        {/* Principles */}
        <section>
          <h2 className="text-base font-semibold tracking-tight">{t('about.principles.title')}</h2>
          <div className="mt-3 divide-y rounded-sm border">
            {[
              { sym: '⚡', title: t('about.principles.fast.title'), desc: t('about.principles.fast.desc') },
              { sym: '∅', title: t('about.principles.noInstall.title'), desc: t('about.principles.noInstall.desc') },
              { sym: '🔒', title: t('about.principles.private.title'), desc: t('about.principles.private.desc') },
              { sym: '< >', title: t('about.principles.open.title'), desc: t('about.principles.open.desc') },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 px-4 py-3.5">
                <span className="font-mono text-xs text-muted-foreground shrink-0 pt-0.5 w-6 text-center">
                  {item.sym}
                </span>
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t" />

        {/* Tech Stack */}
        <section>
          <h2 className="text-base font-semibold tracking-tight">{t('about.stack.title')}</h2>
          <div className="mt-3 divide-y rounded-sm border">
            {[
              [t('about.stack.framework'), t('about.stack.frameworkVal')],
              [t('about.stack.language'), t('about.stack.languageVal')],
              [t('about.stack.styling'), t('about.stack.stylingVal')],
              [t('about.stack.database'), t('about.stack.databaseVal')],
              [t('about.stack.icons'), t('about.stack.iconsVal')],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono text-xs tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
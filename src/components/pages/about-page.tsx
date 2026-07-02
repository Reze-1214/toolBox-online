'use client'

import { useT } from '@/lib/i18n'

const INK = '#202B26'
const BOARD = '#E4E7E2'

export function AboutPage() {
  const { t } = useT()

  return (
    <div className="pb-12" style={{ backgroundColor: BOARD }}>
      <div className="mb-8 max-w-3xl rounded-none border-2 bg-white p-5 sm:p-7" style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: `${INK}CC` }}>
          about
        </p>
        <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl" style={{ color: INK }}>
          {t('about.title')}
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: `${INK}CC` }}>
          {t('about.description')}
        </p>
      </div>

      <div className="max-w-3xl space-y-4">
        <section className="rounded-none border-2 bg-white p-5 sm:p-6" style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}>
          <h2 className="text-base font-black uppercase tracking-[0.16em]" style={{ color: INK }}>{t('about.why.title')}</h2>
          <div className="mt-3 space-y-2.5 text-sm leading-relaxed" style={{ color: `${INK}CC` }}>
            <p>{t('about.why.p1')}</p>
            <p>{t('about.why.p2')}</p>
          </div>
        </section>

        <section className="rounded-none border-2 bg-white p-5 sm:p-6" style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}>
          <h2 className="text-base font-black uppercase tracking-[0.16em]" style={{ color: INK }}>{t('about.principles.title')}</h2>
          <div className="mt-3 divide-y-2" style={{ borderColor: INK }}>
            {[
              { sym: '⚡', title: t('about.principles.fast.title'), desc: t('about.principles.fast.desc') },
              { sym: '∅', title: t('about.principles.noInstall.title'), desc: t('about.principles.noInstall.desc') },
              { sym: '🔒', title: t('about.principles.private.title'), desc: t('about.principles.private.desc') },
              { sym: '< >', title: t('about.principles.open.title'), desc: t('about.principles.open.desc') },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 py-3.5">
                <span className="w-6 shrink-0 pt-0.5 text-center font-mono text-xs" style={{ color: INK }}>
                  {item.sym}
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: `${INK}CC` }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-none border-2 bg-white p-5 sm:p-6" style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}>
          <h2 className="text-base font-black uppercase tracking-[0.16em]" style={{ color: INK }}>{t('about.stack.title')}</h2>
          <div className="mt-3 divide-y-2" style={{ borderColor: INK }}>
            {[
              [t('about.stack.framework'), t('about.stack.frameworkVal')],
              [t('about.stack.language'), t('about.stack.languageVal')],
              [t('about.stack.styling'), t('about.stack.stylingVal')],
              [t('about.stack.database'), t('about.stack.databaseVal')],
              [t('about.stack.icons'), t('about.stack.iconsVal')],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2.5 text-sm">
                <span style={{ color: `${INK}CC` }}>{label}</span>
                <span className="font-mono text-xs tabular-nums" style={{ color: INK }}>{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
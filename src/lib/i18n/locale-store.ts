import { create } from 'zustand'
import type { Locale } from './types'
import { defaultLocale } from './types'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

function getInitialLocale(): Locale {
  return defaultLocale
}

export const useLocale = create<LocaleState>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('toolbox_locale', locale)
    }
    set({ locale })
  },
}))

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('toolbox_locale')
    if (stored === 'id' || stored === 'en') {
      useLocale.setState({ locale: stored })
    }
  } catch {
    // ignore storage errors
  }
}
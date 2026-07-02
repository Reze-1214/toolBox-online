import { useLocale } from './locale-store'
import en from './en'
import id from './id'
import type { TranslationKey } from './en'

const dictionaries = { en, id } as const

type InterpolationValues = Record<string, string | number>

export function useT() {
  const { locale } = useLocale()

  function t(key: TranslationKey | string, values?: InterpolationValues): string {
    let text = dictionaries[locale]?.[key] || dictionaries.en[key as TranslationKey] || key
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  return { t, locale }
}

export function getT(locale: string) {
  function t(key: TranslationKey | string, values?: InterpolationValues): string {
    let text = dictionaries[locale as keyof typeof dictionaries]?.[key] || dictionaries.en[key as TranslationKey] || key
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }
  return t
}
export type Locale = 'en' | 'id'

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
]

export const defaultLocale: Locale = 'en'
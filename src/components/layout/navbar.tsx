'use client'

import { useState, useEffect } from 'react'
import { useNavigation, type Page } from '@/lib/navigation'
import { useAuth } from '@/lib/auth'
import { useT } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n/locale-store'
import { locales } from '@/lib/i18n/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  Menu,
  X,
  Search,
  LogIn,
  User,
  LogOut,
  Heart,
} from 'lucide-react'
import { loadUserFromStorage } from '@/lib/auth'

const navItems: { key: string; page: Page }[] = [
  { key: 'nav.home', page: { type: 'home' } },
  { key: 'nav.tools', page: { type: 'tools' } },
  { key: 'nav.categories', page: { type: 'categories' } },
  { key: 'nav.about', page: { type: 'about' } },
]

const INK = '#202B26'
const BOARD = '#E4E7E2'
const ACCENT = '#E8A33D'

export function Navbar() {
  const { currentPage, navigate } = useNavigation()
  const { user, logout, setUser } = useAuth()
  const { t, locale } = useT()
  const { setLocale } = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const stored = loadUserFromStorage()
    if (stored) setUser(stored)
  }, [setUser])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ type: 'search', query: searchQuery.trim() })
      setSearchOpen(false)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  function handleNav(page: Page) {
    navigate(page)
    setMobileOpen(false)
  }

  function isActive(page: Page): boolean {
    if (page.type === 'home' && currentPage.type === 'home') return true
    if (page.type === 'tools' && currentPage.type === 'tools' && !currentPage.categoryId) return true
    if (page.type === 'categories' && currentPage.type === 'categories') return true
    if (page.type === 'about' && currentPage.type === 'about') return true
    return false
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b-2 transition-colors duration-150"
      style={{
        backgroundColor: BOARD,
        borderColor: INK,
        boxShadow: scrolled ? `0 2px 0 0 ${INK}` : 'none',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
        <button
          onClick={() => handleNav({ type: 'home' })}
          className="flex items-center gap-2 rounded-none border-2 bg-white px-2 py-1.5 text-sm font-semibold tracking-tight transition-transform hover:-translate-y-0.5 sm:px-2.5"
          style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
        >
          <img src="/logo.svg" alt="Toolbox logo" className="h-7 w-7" />
          <span className="font-black uppercase" style={{ color: INK }}>
            toolbox
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.page)}
              className="rounded-none border-2 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.16em] transition-all hover:-translate-y-0.5"
              style={{
                borderColor: isActive(item.page) ? INK : 'transparent',
                backgroundColor: isActive(item.page) ? '#FBEBD3' : 'transparent',
                color: isActive(item.page) ? INK : '#68706b',
              }}
            >
              {t(item.key)}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
            className="rounded-none border-2 px-2.5 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
            style={{ borderColor: INK, color: INK, backgroundColor: '#fff' }}
          >
            {locale === 'en' ? 'EN' : 'ID'}
          </button>
          {currentPage.type !== 'search' && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: INK }} />
              <Input
                type="search"
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 rounded-none border-2 pl-8 text-sm lg:w-56"
                style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
              />
            </form>
          )}
          {user ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNav({ type: 'tools' })}
                className="flex items-center gap-1.5 rounded-none border-2 px-2.5 py-1.5 text-sm transition-transform hover:-translate-y-0.5"
                style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}
                title={t('nav.favorites')}
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-1.5 rounded-none border-2 px-2.5 py-1.5 text-sm" style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}>
                <User className="h-3.5 w-3.5" />
                <span className="max-w-20 truncate">{user.name || user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 rounded-none border-2 px-2 transition-transform hover:-translate-y-0.5"
                style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}
                title={t('nav.logout')}
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNav({ type: 'login' })}
              className="h-8 rounded-none border-2 px-3 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: INK, backgroundColor: ACCENT, color: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              {t('nav.login')}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-none border-2 p-0" style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}>
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" hideCloseButton className="w-[85vw] max-w-sm rounded-none p-0" style={{ backgroundColor: BOARD }}>
              <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
              <div className="flex h-14 items-center justify-between border-b-2 px-4" style={{ borderColor: INK }}>
                <span className="text-sm font-semibold tracking-tight" style={{ color: INK }}>
                  {t('nav.menu')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  className="h-8 w-8 rounded-none border-2 p-0"
                  style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex flex-1 flex-col overflow-y-auto p-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.page)}
                    className="rounded-none border-2 px-3 py-3 text-left text-sm transition-colors"
                    style={{
                      borderColor: isActive(item.page) ? INK : 'transparent',
                      backgroundColor: isActive(item.page) ? '#FBEBD3' : '#fff',
                      color: INK,
                    }}
                  >
                    {t(item.key)}
                  </button>
                ))}
                <div className="my-2 border-t-2" style={{ borderColor: INK }} />
                <div className="flex items-center gap-1.5 px-3 py-2.5">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className="rounded-none border-2 px-3 py-1.5 text-sm font-medium transition-colors"
                      style={{
                        borderColor: locale === l.code ? INK : 'transparent',
                        backgroundColor: locale === l.code ? '#FBEBD3' : '#fff',
                        color: INK,
                      }}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
                <div className="my-2 border-t-2" style={{ borderColor: INK }} />
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-none border-2 px-3 py-2 text-sm" style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}>
                      <User className="h-4 w-4" />
                      <span className="truncate">{user.name || user.email}</span>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false) }}
                      className="flex items-center gap-3 rounded-none border-2 px-3 py-2.5 text-sm transition-colors"
                      style={{ borderColor: INK, backgroundColor: '#fff', color: INK }}
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNav({ type: 'login' })}
                    className="flex items-center gap-3 rounded-none border-2 px-3 py-2.5 text-sm transition-colors"
                    style={{ borderColor: INK, backgroundColor: ACCENT, color: INK }}
                  >
                    <LogIn className="h-4 w-4" />
                    {t('nav.login')}
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

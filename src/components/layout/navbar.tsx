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
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-150 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm' : 'bg-background'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNav({ type: 'home' })}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          <img src="/logo.svg" alt="Toolbox logo" className="h-7 w-7" />
          <span>toolbox</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.page)}
              className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                isActive(item.page)
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(item.key)}
            </button>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {locale === 'en' ? 'EN' : 'ID'}
          </button>
          {currentPage.type !== 'search' && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 rounded-sm border pl-8 text-sm lg:w-56"
              />
            </form>
          )}
          {user ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNav({ type: 'tools' })}
                className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                title={t('nav.favorites')}
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="max-w-20 truncate">{user.name || user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 rounded-sm px-2 text-muted-foreground hover:text-foreground"
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
              className="h-8 rounded-sm"
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              {t('nav.login')}
            </Button>
          )}
        </div>

        {/* Mobile: search + menu */}
        <div className="flex items-center gap-2 md:hidden">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                type="search"
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-36 rounded-sm border pl-8 text-sm"
              />
            </form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-8 w-8 rounded-sm p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-sm p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 rounded-none p-0">
              <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
              <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-sm font-semibold tracking-tight">{t('nav.menu')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  className="h-8 w-8 rounded-sm p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex flex-col p-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.page)}
                    className={`rounded-sm px-3 py-2.5 text-sm transition-colors ${
                      isActive(item.page)
                        ? 'bg-secondary text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(item.key)}
                  </button>
                ))}
                <div className="my-2 border-t" />
                <div className="flex items-center gap-1.5 px-3 py-2.5">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={`rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors ${
                        locale === l.code
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
                <div className="my-2 border-t" />
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="truncate">{user.name || user.email}</span>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false) }}
                      className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNav({ type: 'login' })}
                    className="flex items-center gap-3 rounded-sm px-3 py.2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
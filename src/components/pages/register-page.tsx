'use client'

import { useState } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useAuth, saveUserToStorage } from '@/lib/auth'
import { useT } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const INK = '#202B26'

export function RegisterPage() {
  const { navigate } = useNavigation()
  const { setUser } = useAuth()
  const { toast } = useToast()
  const { t } = useT()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('error.registerFailed'))
        return
      }
      const user = { id: data.id, email: data.email, name: data.name }
      setUser(user)
      saveUserToStorage(user)
      toast({ title: t('register.title'), description: t('register.welcome') })
      navigate({ type: 'home' })
    } catch {
      setError(t('error.somethingWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm rounded-none border-2 bg-white p-5 sm:p-6" style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}>
        <div className="mb-6">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: `${INK}CC` }}>account</p>
          <h1 className="mt-1 text-xl font-black tracking-tight" style={{ color: INK }}>{t('register.title')}</h1>
          <p className="mt-1 text-sm" style={{ color: `${INK}CC` }}>
            {t('register.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>{t('register.name')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.namePlaceholder')}
              className="h-9 rounded-none border-2 text-sm"
              style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>{t('register.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('auth.emailPlaceholder')}
              className="h-9 rounded-none border-2 text-sm"
              style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: INK }}>{t('register.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder={t('auth.passwordHint')}
              className="h-9 rounded-none border-2 text-sm"
              style={{ borderColor: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
            />
          </div>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-9 w-full rounded-none border-2 text-sm font-black uppercase tracking-[0.16em]"
            style={{ borderColor: INK, backgroundColor: '#E8A33D', color: INK, boxShadow: `2px 2px 0 0 ${INK}` }}
          >
            {loading ? t('register.creating') : t('register.submit')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm" style={{ color: `${INK}CC` }}>
          {t('register.hasAccount')}{' '}
          <button
            onClick={() => navigate({ type: 'login' })}
            className="font-black underline-offset-4 hover:underline"
            style={{ color: INK }}
          >
            {t('register.login')}
          </button>
        </p>
      </div>
    </div>
  )
}
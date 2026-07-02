'use client'

import { useState } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useAuth, saveUserToStorage } from '@/lib/auth'
import { useT } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function LoginPage() {
  const { navigate } = useNavigation()
  const { setUser } = useAuth()
  const { toast } = useToast()
  const { t } = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('error.loginFailed'))
        return
      }
      const user = { id: data.id, email: data.email, name: data.name }
      setUser(user)
      saveUserToStorage(user)
      toast({ title: t('login.welcomeBack'), description: `Logged in as ${data.email}` })
      navigate({ type: 'home' })
    } catch {
      setError(t('error.somethingWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">account</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{t('login.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">{t('login.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('auth.emailPlaceholder')}
              className="h-9 rounded-sm text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">{t('login.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('auth.passwordPlaceholder')}
              className="h-9 rounded-sm text-sm"
            />
          </div>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-9 w-full rounded-sm text-sm"
          >
            {loading ? t('login.loggingIn') : t('login.submit')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('login.noAccount')}{' '}
          <button
            onClick={() => navigate({ type: 'register' })}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t('login.register')}
          </button>
        </p>
      </div>
    </div>
  )
}
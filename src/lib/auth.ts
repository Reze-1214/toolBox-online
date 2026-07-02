import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string | null
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user, isLoading: false }),
  logout: () => {
    set({ user: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('toolbox_user')
    }
  },
}))

export function loadUserFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('toolbox_user')
    if (stored) return JSON.parse(stored) as User
  } catch {
    // ignore
  }
  return null
}

export function saveUserToStorage(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('toolbox_user', JSON.stringify(user))
  }
}
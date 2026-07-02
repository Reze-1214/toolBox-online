import { create } from 'zustand'

export type Page =
  | { type: 'home' }
  | { type: 'tools'; categoryId?: string }
  | { type: 'categories' }
  | { type: 'search'; query?: string }
  | { type: 'about' }
  | { type: 'tool'; slug: string }
  | { type: 'login' }
  | { type: 'register' }

interface NavigationState {
  currentPage: Page
  navigate: (page: Page) => void
  goHome: () => void
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPage: { type: 'home' },
  navigate: (page) => {
    set({ currentPage: page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  goHome: () => {
    set({ currentPage: { type: 'home' } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
}))
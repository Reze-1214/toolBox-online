'use client'

import { useNavigation } from '@/lib/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HomePage } from '@/components/pages/home-page'
import { ToolsPage } from '@/components/pages/tools-page'
import { CategoriesPage } from '@/components/pages/categories-page'
import { SearchPage } from '@/components/pages/search-page'
import { AboutPage } from '@/components/pages/about-page'
import { LoginPage } from '@/components/pages/login-page'
import { RegisterPage } from '@/components/pages/register-page'
import { ToolPage } from '@/components/pages/tool-page'

function Router() {
  const { currentPage } = useNavigation()

  switch (currentPage.type) {
    case 'home':
      return <HomePage />
    case 'tools':
      return <ToolsPage categoryId={currentPage.categoryId} />
    case 'categories':
      return <CategoriesPage />
    case 'search':
      return <SearchPage initialQuery={currentPage.query} />
    case 'about':
      return <AboutPage />
    case 'login':
      return <LoginPage />
    case 'register':
      return <RegisterPage />
    case 'tool':
      return <ToolPage slug={currentPage.slug} />
    default:
      return <HomePage />
  }
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Router />
      </main>
      <Footer />
    </div>
  )
}
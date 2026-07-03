import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/api'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/properties', label: 'Imóveis (Admin)' },
    { href: '/', label: 'Site' },
  ]

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/login')
    } else {
      api().get('/api/auth/me')
        .then(res => {
          setUser(res.data)
          setChecking(false)
        })
        .catch(err => {
          router.push('/login')
        })
    }
  }, [])

  if (checking) return <div>Verificando autenticação...</div>

  return (
    <div>
      <div className="md:hidden flex items-center px-4 py-3 bg-surface border-b border-border">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className={`w-64 min-h-screen bg-surface border-r border-border px-4 py-6 
      ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="text-lg font-semibold text-accent mb-6">Imob Crm</div>
          <nav className="flex flex-col gap-2">
            {links.map(link => (
              <Link
                onClick={() => setSidebarOpen(false)}
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm ${
                  router.pathname === link.href
                    ? 'text-accent font-medium' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* conteúdo principal */}
        <main className="flex-1 px-6 py-8">
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-border">
            <span className="text-sm text-text-secondary">
              Olá, {user?.name}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                router.push('/login')
              }}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Sair
            </button>
          </header>
          {children}
        </main>
      </div>
    </div >
  )
}
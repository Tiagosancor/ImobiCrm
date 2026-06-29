import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLayout({ children }){
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/properties', label: 'Imóveis (Admin)' },
    { href: '/', label: 'Site' },
  ]

  return (
    <div>
      <nav className="bg-surface border-b border-border px-6 py-4 flex gap-6">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={
              router.pathname === link.href
                ? 'text-accent font-medium text-sm'
                : 'text-text-secondary text-sm hover:text-text-primary'
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )

  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/login')
    } else {
      setChecking(false)
    }
  }, [])

  if (checking) return <div>Verificando autenticação...</div>

  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/admin/properties">Imóveis (Admin)</Link>
          <Link href="/">Site</Link>
        </nav>
      </header>
      <main style={{ padding: 12 }}>{children}</main>
    </div>
  )
}

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLayout({ children }){
  const router = useRouter()
  const [checking, setChecking] = useState(true)

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

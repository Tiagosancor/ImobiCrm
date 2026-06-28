import Link from 'next/link'
export default function Layout({ children }) {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  )
}

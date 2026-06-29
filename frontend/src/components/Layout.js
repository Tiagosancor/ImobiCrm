import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ]

  return (
    <div>
      <header className="bg-surface border-b border-border px-6 py-4">
        <nav className="flex gap-6">
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
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
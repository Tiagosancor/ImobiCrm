import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Layout from '@/components/Layout'

export default function Home() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)

  const search = async (e) => {
    e && e.preventDefault()
    const res = await axios.get(`/api/properties?city=${encodeURIComponent(q)}&page=1&pageSize=20`, { baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' })
    setResults(res.data)
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Card>
        <h1 className="text-3xl font-semibold mb-6">Busca de Imóveis</h1>
        <form onSubmit={search} className="flex gap-3 mb-10">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cidade"
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button type="submit" variant="primary">Buscar</Button>
        </form>
        </Card>

        {results && (
          <div>
            <p className="text-sm text-text-secondary mb-4">Resultados: {results.total}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.items.map(p => (
                <Link key={p.id} href={`/properties/${p.id}`}>
                  <Card className="hover:border-accent transition-colors">
                    <p className="font-medium mb-1">{p.title}</p>
                    <p className="text-accent font-semibold">R$ {p.price}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
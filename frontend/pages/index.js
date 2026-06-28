import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function Home() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)

  const search = async (e) => {
    e && e.preventDefault()
    const res = await axios.get(`/api/properties?city=${encodeURIComponent(q)}&page=1&pageSize=20`, { baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' })
    setResults(res.data)
  }

  return (
    <div>
      <h1>Busca de Imóveis</h1>
      <form onSubmit={search}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cidade" />
        <button type="submit">Buscar</button>
      </form>

      {results && (
        <div>
          <p>Resultados: {results.total}</p>
          <ul>
            {results.items.map(p => (
              <li key={p.id}>
                <Link href={`/properties/${p.id}`}>{p.title} - R$ {p.price}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

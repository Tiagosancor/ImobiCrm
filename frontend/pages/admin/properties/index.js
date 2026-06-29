import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

export default function AdminProperties(){
  const [items, setItems] = useState([])

  const load = async ()=>{
    try{
      const res = await api().get('/api/properties?page=1&pageSize=1000')
      setItems(res.data.items)
    }catch(err){
      alert('Falha ao carregar imóveis')
    }
  }

  useEffect(()=>{ load() }, [])

  const remove = async (id)=>{
    if(!confirm('Confirma exclusão?')) return
    await api().delete(`/api/properties/${id}`)
    load()
  }

  const toggleActive = async (id, active)=>{
    await api().post(`/api/properties/${id}/${active ? 'deactivate' : 'activate'}`)
    load()
  }

  return (
    <AdminLayout>
      <h1>Imóveis</h1>
      <p><Link href="/admin/properties/new">Criar imóvel</Link></p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Id</th><th>Título</th><th>Preço</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {items.map(p=> (
            <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>R$ {p.price}</td>
              <td>{p.active ? 'Ativo' : 'Inativo'}</td>
              <td>
                <Link href={`/admin/properties/${p.id}/edit`}>Editar</Link>
                {' | '}
                <a href="#" onClick={e=>{e.preventDefault(); toggleActive(p.id, p.active)}}>{p.active ? 'Desativar' : 'Ativar'}</a>
                {' | '}
                <a href="#" onClick={e=>{e.preventDefault(); remove(p.id)}}>Excluir</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}

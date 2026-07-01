import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

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
      <h1 className="text-2xl font-semibold mb-4">Imóveis</h1>
      <p className="mb-6">
        <Link href="/admin/properties/new" className="text-accent text-sm font-medium">Criar imóvel</Link>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <Card key={p.id} className="p-0 overflow-hidden">
            <div className="h-24 bg-background flex items-center justify-center text-text-muted text-sm">
              Imóvel #{p.id}
            </div>
            <div className="p-4">
              <p className="font-medium">{p.title}</p>
              <div className="flex items-center justify-between mt-2 mb-3">
                <span className="text-accent font-semibold">R$ {p.price}</span>
                <Badge status={p.active ? 'ativo' : 'inativo'}>{p.active ? 'Ativo' : 'Inativo'}</Badge>
              </div>
              <div className="flex gap-3 text-sm border-t border-border pt-3">
                <Link href={`/admin/properties/${p.id}/edit`} className="text-accent">Editar</Link>
                <a
                  href="#"
                  onClick={e=>{e.preventDefault(); toggleActive(p.id, p.active)}}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {p.active ? 'Desativar' : 'Ativar'}
                </a>
                
                <a
                  href="#"
                  onClick={e=>{e.preventDefault(); remove(p.id)}}
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}
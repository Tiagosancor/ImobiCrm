import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const statuses = ['Novo', 'Contatado', 'Visita Agendada', 'Fechado', 'Perdido']

const STATUS_KEY = {
  'Novo': 'novo',
  'Contatado': 'contatado',
  'Visita Agendada': 'visita',
  'Fechado': 'fechado',
  'Perdido': 'perdido',
}

export default function AdminLeads(){
  const [items, setItems] = useState([])
  const [filterStatus, setFilterStatus] = useState('Todos')

  const load = async ()=>{
    try{
      const res = await api().get('/api/leads')
      setItems(res.data)
    }catch(err){
      alert('Falha ao carregar leads')
    }
  }

  useEffect(()=>{ load() }, [])

  const filteredItems = useMemo(() => {
    if (filterStatus === 'Todos') return items
    return items.filter(lead => lead.status === filterStatus)
  }, [items, filterStatus])

  const updateStatus = async (id, status)=>{
    try{
      const res = await api().put(`/api/leads/${id}/status`, { status })
      setItems(current => current.map(item => item.id === id ? res.data : item))
    }catch(err){
      alert('Falha ao atualizar status do lead')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>

      <div className="mb-4">
        <label className="inline-flex gap-2 items-center text-sm text-text-secondary">
          Filtrar por status:
          <select
            value={filterStatus}
            onChange={e=>setFilterStatus(e.target.value)}
            className="border border-border rounded-md px-2 py-1 text-sm"
          >
            <option value="Todos">Todos</option>
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-text-secondary uppercase border-b border-border">
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Telefone</th>
              <th className="text-left p-3">Imóvel</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(lead=> (
              <tr key={lead.id} className="border-b border-border hover:bg-background">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email || '-'}</td>
                <td className="p-3">{lead.phone || '-'}</td>
                <td className="p-3">
                  {lead.propertyId ? <Link href={`/admin/properties/${lead.propertyId}/edit`} className="text-accent">Ver imóvel #{lead.propertyId}</Link> : '-'}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Badge status={STATUS_KEY[lead.status]}>{lead.status}</Badge>
                    <select
                      value={lead.status}
                      onChange={e=>updateStatus(lead.id, e.target.value)}
                      className="border border-border rounded-md px-2 py-1 text-xs"
                    >
                      {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {!filteredItems.length && <p className="mt-4 text-sm text-text-secondary">Nenhum lead encontrado.</p>}
    </AdminLayout>
  )
}
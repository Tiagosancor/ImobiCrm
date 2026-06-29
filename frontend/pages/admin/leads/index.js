import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const statuses = ['Novo', 'Contatado', 'Visita Agendada', 'Fechado', 'Perdido']

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
      <h1>Leads</h1>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          Filtrar por status:
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="Todos">Todos</option>
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Imóvel</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(lead=> (
            <tr key={lead.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{lead.name}</td>
              <td>{lead.email || '-'}</td>
              <td>{lead.phone || '-'}</td>
              <td>{lead.propertyId ? <Link href={`/admin/properties/${lead.propertyId}/edit`}>Ver imóvel #{lead.propertyId}</Link> : '-'}</td>
              <td>
                <select value={lead.status} onChange={e=>updateStatus(lead.id, e.target.value)}>
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filteredItems.length && <p style={{ marginTop: 12 }}>Nenhum lead encontrado.</p>}
    </AdminLayout>
  )
}
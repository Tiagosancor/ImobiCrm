import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const statuses = ['Novo', 'Contatado', 'Visita Agendada', 'Fechado', 'Perdido']

export default function AdminDashboard(){
  const [propertyTotal, setPropertyTotal] = useState(0)
  const [leads, setLeads] = useState([])

  const load = async ()=>{
    try{
      const [propertiesRes, leadsRes] = await Promise.all([
        api().get('/api/properties?page=1&pageSize=1'),
        api().get('/api/leads'),
      ])
      setPropertyTotal(propertiesRes.data.total || 0)
      setLeads(leadsRes.data || [])
    }catch(err){
      alert('Falha ao carregar dashboard')
    }
  }

  useEffect(()=>{ load() }, [])

  const leadCounts = useMemo(() => {
    const counts = Object.fromEntries(statuses.map(status => [status, 0]))
    leads.forEach(lead => {
      if (counts[lead.status] !== undefined) counts[lead.status] += 1
    })
    return counts
  }, [leads])

  return (
    <AdminLayout>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <Card title="Total de imóveis" value={propertyTotal} />
        <Card title="Total de leads" value={leads.length} />
        {statuses.map(status => (
          <Card key={status} title={`Leads: ${status}`} value={leadCounts[status]} />
        ))}
      </div>
    </AdminLayout>
  )
}

function Card({ title, value }){
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 14, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
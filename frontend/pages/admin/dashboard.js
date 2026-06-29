import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'
import MetricCard from '@/components/ui/MetricCard'

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
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total de imóveis" value={propertyTotal} />
        <MetricCard label="Total de leads" value={leads.length} />
        {statuses.map(status => (
          <MetricCard key={status} label={`Leads: ${status}`} value={leadCounts[status]} />
        ))}
      </div>
    </AdminLayout>
  )
}
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { propertyService } from '@/services/propertyService'

export default function AdminProperties() {
  const [items, setItems] = useState([])
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const load = async () => {
    try {
      const res = await propertyService.listAdmin({ page: 1, pageSize: 1000 })
      setItems(res.data.items)
    } catch (err) {
      alert('Falha ao carregar imóveis')
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    await propertyService.delete(id)
    load()
  }

  const confirmDelete = async () => {
    const id = pendingDeleteId
    setPendingDeleteId(null)
    await remove(id)
  }

  const toggleActive = async (id, active) => {
    await (active ? propertyService.deactivate(id) : propertyService.activate(id))
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
                  onClick={e => { e.preventDefault(); toggleActive(p.id, p.active) }}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {p.active ? 'Desativar' : 'Ativar'}
                </a>

                <a
                  href="#"
                  onClick={e => { e.preventDefault(); setPendingDeleteId(p.id) }}
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={pendingDeleteId !== null} onClose={() => setPendingDeleteId(null)} title="Confirmar exclusão">
        <p className="text-sm text-text-secondary mb-5">
          Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { clientService } from '@/services/clientService'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

export default function AdminClients() {
    const [items, setItems] = useState([])
    const [nameFilter, setNameFilter] = useState('')
    const [documentFilter, setDocumentFilter] = useState('')

    const load = async () => {
        try {
            const res = await clientService.list({
                name: nameFilter || undefined,
                document: documentFilter || undefined,
            })
            setItems(res.data.items)
        } catch (err) {
            alert('Falha ao carregar clientes')
        }
    }

    useEffect(() => { load() }, [])

    const search = (e) => {
        e.preventDefault()
        load()
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-semibold mb-4">Clientes</h1>

            <p className="mb-6">
                <Link href="/admin/clients/new" className="text-accent text-sm font-medium">Criar cliente</Link>
            </p>

            <form onSubmit={search} className="flex gap-3 mb-6">
                <Input
                    placeholder="Buscar por nome"
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                />
                <Input
                    placeholder="Buscar por documento"
                    value={documentFilter}
                    onChange={e => setDocumentFilter(e.target.value)}
                />
                <Button type="submit" variant="primary">Buscar</Button>
            </form>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-text-secondary uppercase border-b border-border">
                            <th className="text-left p-3">Nome</th>
                            <th className="text-left p-3">Documento</th>
                            <th className="text-left p-3">Tipo</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(client => (
                            <tr key={client.id} className="border-b border-border hover:bg-background">
                                <td className="p-3">{client.name}</td>
                                <td className="p-3">{client.document}</td>
                                <td className="p-3">{client.type === 'Individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                                <td className="p-3">{client.active ? 'Ativo' : 'Inativo'}</td>
                                <td className="p-3">
                                    <a href="#" className="text-accent">Editar</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {!items.length && <p className="mt-4 text-sm text-text-secondary">Nenhum cliente encontrado.</p>}
        </AdminLayout>
    )
}
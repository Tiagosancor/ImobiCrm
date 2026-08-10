import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'
import { clientService } from '@/services/clientService'
import FormInput from '@/components/FormInput'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function EditClient() {
    const router = useRouter()
    const { id } = router.query
    const [client, setClient] = useState(null)
    const [name, setName] = useState('')
    const [document, setDocument] = useState('')
    const [type, setType] = useState('')
    const [observations, setObservations] = useState('')

    const load = async () => {
        if (!id) return
        const res = await clientService.getById(id)
        setClient(res.data)
        setName(res.data.name)
        setDocument(res.data.document)
        setType(res.data.type)
        setObservations(res.data.observations || '')
    }

    useEffect(() => { load() }, [id])

    const [errors, setErrors] = useState({})

    const save = async (e) => {
        e.preventDefault()
        const errs = {}
        if (!name) errs.name = 'Nome é obrigatório'
        if (!document) errs.document = 'Documento é obrigatório'
        if (!type) errs.type = 'Tipo é obrigatório'
        setErrors(errs)
        if (Object.keys(errs).length) return
        await clientService.update(id, { name, document, type, observations, active: client ? client.active : true })
        alert('Salvo')
    }

    if (!client) return <AdminLayout><div>Carregando...</div></AdminLayout>

    return (
        <AdminLayout>
            <h1 className="text-2xl font-semibold mb-6">Editar Cliente</h1>
            <Card>
                <form onSubmit={save}>
                    <FormInput label="Nome" value={name} onChange={setName} error={errors?.name} />
                    <FormInput label="Documento" value={document} onChange={setDocument} error={errors?.document} />
                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-1">Tipo</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="Individual">Pessoa Física</option>
                            <option value="Company">Pessoa Jurídica</option>
                        </select>
                    </div>
                    <FormInput label="Observações" textarea value={observations} onChange={setObservations} error={errors?.observations} />
                    <Button type="submit" variant="primary">Salvar</Button>
                </form>
            </Card>
        </AdminLayout>
    )

}


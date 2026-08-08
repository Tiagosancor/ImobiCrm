import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { clientService } from '@/services/clientService'
import Router from 'next/router'
import FormInput from '@/components/FormInput'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function NewClient() {
    const [name, setName] = useState('')
    const [document, setDocument] = useState('')
    const [type, setType] = useState('Individual')
    const [observations, setObservations] = useState('')
    const [errors, setErrors] = useState({})

    const submit = async (e) => {
        e.preventDefault()
        if (!name) return alert('Nome é obrigatório')
        if (!document) return alert('Documento é obrigatório')
        if (!type) return alert('Tipo é obrigatório')

        try {
            await clientService.create({ name, document, type, observations })
            Router.push('/admin/clients')
        } catch (error) {
            console.error('Error creating client:', error)
        }
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-semibold mb-6">Criar Cliente</h1>
            <Card>
                <form onSubmit={submit}>
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
                    <Button type="submit" variant="primary">Criar Cliente</Button>
                </form>
            </Card>
        </AdminLayout>
    )
}
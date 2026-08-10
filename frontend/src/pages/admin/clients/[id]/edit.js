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
    const [phones, setPhones] = useState([])
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [newPhoneIsWhatsapp, setNewPhoneIsWhatsapp] = useState(false)
    const [newPhoneIsMain, setNewPhoneIsMain] = useState(false)

    const load = async () => {
        if (!id) return
        const res = await clientService.getById(id)
        const phonesRes = await clientService.listPhones(id)
        setClient(res.data)
        setName(res.data.name)
        setDocument(res.data.document)
        setType(res.data.type)
        setObservations(res.data.observations || '')
        setPhones(phonesRes.data || [])
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

    const addPhone = async (e) => {
        e.preventDefault()
        if (!newPhoneNumber) return alert('Número de telefone é obrigatório')
        await clientService.addPhone(id, {
            phoneNumber: newPhoneNumber,
            isWhatsapp: newPhoneIsWhatsapp,
            isMain: newPhoneIsMain
        })

        setNewPhoneNumber('')
        setNewPhoneIsWhatsapp(false)
        setNewPhoneIsMain(false)

        load()
    }

    const removePhone = async (phoneId) => {
        if (!confirm('Remover telefone?')) return
        await clientService.removePhone(id, phoneId)
        load()
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
            <Card className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Telefones</h2>
                <ul className="mb-4">
                    {phones.map(phone => (
                        <li key={phone.id} className="flex justify-between items-center border-b border-border py-2">
                            <span>{phone.phoneNumber}</span>
                            <div className="flex space-x-2">
                                {phone.isWhatsapp && <span className="text-xs text-green-500">WhatsApp</span>}
                                {phone.isMain && <span className="text-xs text-blue-500">Principal</span>}
                                <a href="#" onClick={e => { e.preventDefault(); removePhone(phone.id) }} className="text-xs text-red-500 hover:text-red-700">
                                    Remover
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <form onSubmit={addPhone}>
                    <FormInput label="Número de Telefone" value={newPhoneNumber} onChange={setNewPhoneNumber} />
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isWhatsapp"
                            checked={newPhoneIsWhatsapp}
                            onChange={e => setNewPhoneIsWhatsapp(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="isWhatsapp" className="text-sm text-text-secondary">É WhatsApp</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isMain"
                            checked={newPhoneIsMain}
                            onChange={e => setNewPhoneIsMain(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="isMain" className="text-sm text-text-secondary">É Principal</label>
                    </div>
                    <Button type="submit" variant="secondary">Adicionar Telefone</Button>
                </form>
            </Card>
        </AdminLayout>
    )

}


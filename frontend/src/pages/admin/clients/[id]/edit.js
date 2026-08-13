import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'
import { clientService } from '@/services/clientService'
import FormInput from '@/components/FormInput'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { propertyService } from '@/services/propertyService'

const brazilianStates = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

const relationTypes = [
    { value: 'Interested', label: 'Interessado' },
    { value: 'Buyer', label: 'Comprador' },
    { value: 'Owner', label: 'Proprietário' },
    { value: 'Lessee', label: 'Locatário' },
    { value: 'Guarantor', label: 'Fiador' },
    { value: 'Other', label: 'Outro' },
]

export default function EditClient() {
    const router = useRouter()
    const { id } = router.query
    const [client, setClient] = useState(null)
    const [name, setName] = useState('')
    const [document, setDocument] = useState('')
    const [type, setType] = useState('Individual')
    const [observations, setObservations] = useState('')
    const [phones, setPhones] = useState([])
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [newPhoneIsWhatsapp, setNewPhoneIsWhatsapp] = useState(false)
    const [newPhoneIsMain, setNewPhoneIsMain] = useState(false)
    const [emails, setEmails] = useState([])
    const [newEmail, setNewEmail] = useState('')
    const [newEmailIsMain, setNewEmailIsMain] = useState(false)
    const [addresses, setAddresses] = useState([])
    const [newStreet, setNewStreet] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newComplement, setNewComplement] = useState('')
    const [newNeighborhood, setNewNeighborhood] = useState('')
    const [newCity, setNewCity] = useState('')
    const [newState, setNewState] = useState('')
    const [newZipCode, setNewZipCode] = useState('')
    const [newIsMain, setNewIsMain] = useState(false)
    const [serviceHistory, setServiceHistory] = useState([])
    const [newNotes, setNewNotes] = useState('')
    const [clientProperties, setClientProperties] = useState([])
    const [availableProperties, setAvailableProperties] = useState([])
    const [newPropertyId, setNewPropertyId] = useState('')
    const [newRelationType, setNewRelationType] = useState('Owner')


    const load = async () => {
        if (!id) return
        const res = await clientService.getById(id)
        const phonesRes = await clientService.listPhones(id)
        const emailsRes = await clientService.listEmails(id)
        const addressesRes = await clientService.listAddresses(id)
        const serviceHistoryRes = await clientService.listServiceHistory(id)
        const clientPropertiesRes = await clientService.listClientProperties(id)
        const availablePropertiesRes = await propertyService.listAdmin({ page: 1, pageSize: 1000 })
        setClient(res.data)
        setName(res.data.name)
        setDocument(res.data.document)
        setType(res.data.type)
        setObservations(res.data.observations || '')
        setEmails(emailsRes.data || [])
        setPhones(phonesRes.data || [])
        setAddresses(addressesRes.data || [])
        setAvailableProperties(availablePropertiesRes.data.items || [])
        setClientProperties(clientPropertiesRes.data || [])
        setServiceHistory(serviceHistoryRes.data || [])
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

    const addEmail = async (e) => {
        e.preventDefault()
        if (!newEmail) return alert('Email é obrigatório')
        await clientService.addEmail(id, {
            email: newEmail,
            isMain: newEmailIsMain
        })

        setNewEmail('')
        setNewEmailIsMain(false)

        load()
    }

    const removeEmail = async (emailId) => {
        if (!confirm('Remover email?')) return
        await clientService.removeEmail(id, emailId)
        load()
    }

    const addAddress = async (e) => {
        e.preventDefault()
        if (!newStreet) return alert('Rua é obrigatória')
        if (!newNeighborhood) return alert('Bairro é obrigatório')
        if (!newCity) return alert('Cidade é obrigatória')
        if (!newState) return alert('Estado é obrigatório')
        if (!newZipCode) return alert('CEP é obrigatório')

        await clientService.addAddress(id, {
            street: newStreet,
            number: newNumber,
            complement: newComplement,
            neighborhood: newNeighborhood,
            city: newCity,
            state: newState,
            zipCode: newZipCode,
            isMain: newIsMain
        })

        setNewStreet('')
        setNewNumber('')
        setNewComplement('')
        setNewNeighborhood('')
        setNewCity('')
        setNewState('')
        setNewZipCode('')
        setNewIsMain(false)

        load()
    }

    const removeAddress = async (addressId) => {
        if (!confirm('Remover endereço?')) return
        await clientService.removeAddress(id, addressId)
        load()
    }

    const addServiceHistory = async (e) => {
        e.preventDefault()
        await clientService.addServiceHistory(id, {
            notes: newNotes
        })
        setNewNotes('')
        load()
    }

    const addClientProperty = async (e) => {
        e.preventDefault()
        if (!newPropertyId) return alert('Selecione uma propriedade')
        if (!newRelationType) return alert('Selecione um tipo de relação')

        try {
            await clientService.addClientProperty(id, newPropertyId, {
                relationType: newRelationType
            })

            setNewPropertyId('')
            setNewRelationType('Owner')

            load()
        } catch (err) {
            alert(err?.response?.data?.error || 'Falha ao adicionar imóvel')
        }
    }

    const removeClientProperty = async (propertyId) => {
        if (!confirm('Remover relação com a propriedade?')) return
        await clientService.removeClientProperty(id, propertyId)
        load()
    }

    const updateClientProperty = async (propertyId, relationType) => {
        await clientService.updateClientProperty(id, propertyId, {
            relationType
        })
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
            <Card className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Emails</h2>
                <ul className="mb-4">
                    {emails.map(email => (
                        <li key={email.id} className="flex justify-between items-center border-b border-border py-2">
                            <span>{email.emailAddress}</span>
                            <div className="flex space-x-2">
                                {email.isMain && <span className="text-xs text-blue-500">Principal</span>}
                                <a href="#" onClick={e => { e.preventDefault(); removeEmail(email.id) }} className="text-xs text-red-500 hover:text-red-700">
                                    Remover
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <form onSubmit={addEmail}>
                    <FormInput label="Endereço de Email" value={newEmail} onChange={setNewEmail} />
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isMainEmail"
                            checked={newEmailIsMain}
                            onChange={e => setNewEmailIsMain(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="isMainEmail" className="text-sm text-text-secondary">É Principal</label>
                    </div>
                    <Button type="submit" variant="secondary">Adicionar Email</Button>
                </form>
            </Card>
            <Card className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Endereços</h2>
                <ul className="mb-4">
                    {addresses.map(address => (
                        <li key={address.id} className="flex justify-between items-center border-b border-border py-2">
                            <span>{address.street}, {address.number} - {address.complement} - {address.neighborhood} - {address.city}/{address.state}</span>
                            <div className="flex space-x-2">
                                {address.isMain && <span className="text-xs text-blue-500">Principal</span>}
                                <a href="#" onClick={e => { e.preventDefault(); removeAddress(address.id) }} className="text-xs text-red-500 hover:text-red-700">
                                    Remover
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <form onSubmit={addAddress}>
                    <FormInput label="Rua" value={newStreet} onChange={setNewStreet} />
                    <FormInput label="Número" value={newNumber} onChange={setNewNumber} />
                    <FormInput label="Complemento" value={newComplement} onChange={setNewComplement} />
                    <FormInput label="Bairro" value={newNeighborhood} onChange={setNewNeighborhood} />
                    <FormInput label="Cidade" value={newCity} onChange={setNewCity} />
                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-1">UF</label>
                        <select
                            value={newState}
                            onChange={e => setNewState(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            {brazilianStates.map(state => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <FormInput label="CEP" value={newZipCode} onChange={setNewZipCode} />
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isMainAddress"
                            checked={newIsMain}
                            onChange={e => setNewIsMain(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="isMainAddress" className="text-sm text-text-secondary">É Principal</label>
                    </div>
                    <Button type="submit" variant="secondary">Adicionar Endereço</Button>
                </form>
            </Card>
            <Card>
                <h2 className="text-xl font-semibold mb-4">Histórico de Atendimento</h2>
                <ul className="mb-4">
                    {serviceHistory.map((serviceHistoryItem) => (
                        <li key={serviceHistoryItem.id} className="py-2 border-b border-border">
                            <span>{serviceHistoryItem.notes} - {serviceHistoryItem.user.name} - {new Date(serviceHistoryItem.createdAt).toLocaleDateString('pt-BR')}</span>
                        </li>
                    ))}
                </ul>
                <form onSubmit={addServiceHistory}>
                    <FormInput label="Adicionar Nota" textarea value={newNotes} onChange={setNewNotes} />
                    <Button type="submit" variant="secondary">Adicionar Nota</Button>
                </form>
            </Card>
            <Card className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Imóveis Associados</h2>
                <ul className="mb-4">
                    {clientProperties.map(item => (
                        <li key={item.propertyId} className="flex justify-between items-center border-b border-border py-2">
                            <span>{item.property?.title}</span>
                            <div className="flex items-center gap-2">
                                <select
                                    value={item.relationType}
                                    onChange={e => updateClientProperty(item.propertyId, e.target.value)}
                                    className="border border-border rounded-md px-2 py-1 text-xs"
                                >
                                    {relationTypes.map(rt => (
                                        <option key={rt.value} value={rt.value}>{rt.label}</option>
                                    ))}
                                </select>
                                <a
                                    href="#"
                                    onClick={e => { e.preventDefault(); removeClientProperty(item.propertyId) }}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Remover
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <form onSubmit={addClientProperty}>
                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-1">Imóvel</label>
                        <select
                            value={newPropertyId}
                            onChange={e => setNewPropertyId(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm"
                        >
                            <option value="">Selecione um imóvel</option>
                            {availableProperties.map(property => (
                                <option key={property.id} value={property.id}>
                                    {property.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-1">Tipo de Relação</label>
                        <select
                            value={newRelationType}
                            onChange={e => setNewRelationType(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm"
                        >
                            {relationTypes.map(rt => (
                                <option key={rt.value} value={rt.value}>{rt.label}</option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" variant="secondary">Adicionar Imóvel</Button>
                </form>
            </Card>
        </AdminLayout>
    )
}


import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FormInput from '@/components/FormInput'
import Button from '@/components/ui/Button'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function PropertyPage(){
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(()=>{
    if(!id) return
    axios.get(`/api/properties/${id}`, { baseURL: API_URL })
      .then(res=>setProperty(res.data))
  },[id])

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSent(false)
    try {
      await axios.post('/api/leads', {
        propertyId: Number(id),
        name,
        email: email.trim() || null,
        phone: phone.trim() || null,
        message: message.trim() || null,
      }, { baseURL: API_URL })
      setSent(true)
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (error) {
      alert('Falha ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  if(!property) return <div className="max-w-3xl mx-auto px-6 py-12 text-text-secondary">Carregando...</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">{property.title}</h1>

      {property.images?.length ? (
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {property.images.map(image => (
            <img
              key={image.id}
              src={`${API_URL}/uploads/${image.fileName}`}
              alt={property.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          ))}
        </div>
      ) : null}

      <p className="text-text-secondary mb-4">{property.description}</p>
      <p className="text-2xl text-accent font-semibold mb-6">R$ {property.price}</p>

      <ul className="grid grid-cols-2 gap-2 text-sm text-text-secondary mb-10">
        <li>Quartos: {property.bedrooms ?? '-'}</li>
        <li>Banheiros: {property.bathrooms ?? '-'}</li>
        <li>Vagas: {property.garageSpaces ?? '-'}</li>
        <li>Área: {property.area ?? '-'}</li>
        <li>Cidade: {property.city || '-'}</li>
        <li>Bairro: {property.neighborhood || '-'}</li>
      </ul>

      <h2 className="text-lg font-semibold mb-3">Contato</h2>
      {sent && <p className="text-green-700 bg-green-50 rounded-md px-3 py-2 mb-4 text-sm">Mensagem enviada! Entraremos em contato em breve.</p>}

      <form onSubmit={submit} className="grid gap-1 max-w-md">
        <FormInput value={name} onChange={setName} placeholder="Nome" required />
        <FormInput value={email} onChange={setEmail} placeholder="Email" />
        <FormInput value={phone} onChange={setPhone} placeholder="Telefone" />
        <FormInput value={message} onChange={setMessage} placeholder="Mensagem" textarea rows={5} />
        <Button type="submit" variant="primary" disabled={sending} className="mt-2 w-fit">
          {sending ? 'Enviando...' : 'Enviar mensagem'}
        </Button>
      </form>
    </div>
  )
}
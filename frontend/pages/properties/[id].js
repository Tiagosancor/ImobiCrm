import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

  if(!property) return <div>Carregando...</div>

  return (
    <div>
      <h1>{property.title}</h1>
      {property.images?.length ? (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 16 }}>
          {property.images.map(image => (
            <img
              key={image.id}
              src={`${API_URL}/uploads/${image.fileName}`}
              alt={property.title}
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
            />
          ))}
        </div>
      ) : null}
      <p>{property.description}</p>
      <p>Preço: R$ {property.price}</p>
      <ul>
        <li>Quartos: {property.bedrooms ?? '-'}</li>
        <li>Banheiros: {property.bathrooms ?? '-'}</li>
        <li>Vagas: {property.garageSpaces ?? '-'}</li>
        <li>Área: {property.area ?? '-'}</li>
        <li>Cidade: {property.city || '-'}</li>
        <li>Bairro: {property.neighborhood || '-'}</li>
      </ul>

      <h2>Contato</h2>
      {sent && <p>Mensagem enviada! Entraremos em contato em breve.</p>}
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Telefone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <textarea placeholder="Mensagem" value={message} onChange={e=>setMessage(e.target.value)} rows={5} />
        <button type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Enviar mensagem'}</button>
      </form>
    </div>
  )
}

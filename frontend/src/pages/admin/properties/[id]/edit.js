import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/src/components/AdminLayout'
import { api } from '@/src/lib/api'
import FormInput from '@/src/components/FormInput'

export default function EditProperty(){
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])

  const load = async ()=>{
    if(!id) return
    const res = await api().get(`/api/properties/${id}`)
    setProperty(res.data)
    setTitle(res.data.title)
    setPrice(res.data.price)
    setDescription(res.data.description || '')
    setImages(res.data.images || [])
  }

  useEffect(()=>{ load() }, [id])

  const [errors, setErrors] = useState({})

  const save = async (e)=>{
    e.preventDefault()
    const errs = {}
    if(!title) errs.title = 'Título é obrigatório'
    if(price <= 0) errs.price = 'Preço deve ser maior que zero'
    setErrors(errs)
    if(Object.keys(errs).length) return
    await api().put(`/api/properties/${id}`, { title, description, price, bedrooms: property.bedrooms, bathrooms: property.bathrooms, garageSpaces: property.garageSpaces, area: property.area, city: property.city, neighborhood: property.neighborhood, active: property.active || true })
    alert('Salvo')
  }

  const upload = async (e)=>{
    const file = e.target.files[0]
    if(!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await api().post(`/api/properties/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setImages(prev => [...prev, { id: res.data.id, fileName: res.data.fileName }])
  }

  const removeImage = async (imageId)=>{
    if(!confirm('Remover imagem?')) return
    await api().delete(`/api/properties/${id}/images/${imageId}`)
    setImages(prev => prev.filter(i => i.id !== imageId))
  }

  if(!property) return <AdminLayout><div>Carregando...</div></AdminLayout>

  return (
    <AdminLayout>
      <h1>Editar Imóvel #{id}</h1>
      <form onSubmit={save}>
        <FormInput label="Título" value={title} onChange={setTitle} error={errors.title} />
        <FormInput label="Preço" type="number" value={price} onChange={v=>setPrice(Number(v))} error={errors.price} />
        <FormInput label="Descrição" textarea value={description} onChange={setDescription} />
        <button type="submit">Salvar</button>
      </form>

      <section>
        <h2>Imagens</h2>
        <input type="file" onChange={upload} />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {images.map(img => (
            <div key={img.id} style={{ textAlign: 'center' }}>
              <img src={(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/uploads/' + img.fileName} alt="" style={{ width: 120, height: 80, objectFit: 'cover' }} />
              <div><button onClick={()=>removeImage(img.id)}>Remover</button></div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  )
}

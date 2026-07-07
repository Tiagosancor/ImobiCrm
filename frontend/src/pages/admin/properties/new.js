import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { propertyService } from '@/services/propertyService'
import Router from 'next/router'
import FormInput from '@/components/FormInput'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function NewProperty() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState()
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [bedrooms, setBedrooms] = useState(0)
  const [bathrooms, setBathrooms] = useState(1)
  const [garageSpaces, setGarageSpaces] = useState(0)
  const [area, setArea] = useState('')
  const areaNumber = area ? Number(area.replace(',', '.')) : null
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [active, setActive] = useState(true)

  const submit = async (e) => {
    e.preventDefault()
    if (!title) return alert('Título é obrigatório')
    if (!price) return alert('Preço é obrigatório')
    if (price <= 0) return alert('Preço deve ser maior que zero')
    if (bedrooms < 0) return alert('Número de quartos deve ser maior que zero')
    if (bathrooms < 0) return alert('Número de banheiros deve ser maior que zero')
    if (garageSpaces < 0) return alert('Número de vagas de garagem deve ser maior ou igual a zero')
    if (!areaNumber || isNaN(areaNumber) || areaNumber <= 0) return alert('Área deve ser um número maior que zero')
    if (!city) return alert('Cidade é obrigatória')
    if (!neighborhood) return alert('Bairro é obrigatório')
    try {
      const res = await propertyService.create({ title, description, price, bedrooms, bathrooms, garageSpaces, area: areaNumber, city, neighborhood, active })
      Router.push('/admin/properties')
    } catch (err) {
      alert(err?.response?.data?.error || 'Erro ao criar')
    }
  }

  return (
    <AdminLayout>
      <h1>Criar Imóvel</h1>
      <Card>
        <form onSubmit={submit}>
          <FormInput label="Título" value={title} onChange={setTitle} error={errors?.title} />
          <FormInput label="Preço" type="number" value={price} onChange={v => setPrice(Number(v))} error={errors?.price} />
          <FormInput label="Descrição" textarea value={description} onChange={setDescription} />
          <FormInput label="Quartos" type="number" value={bedrooms} onChange={v => setBedrooms(Number(v))} error={errors?.bedrooms} />
          <FormInput label="Banheiros" type="number" value={bathrooms} onChange={v => setBathrooms(Number(v))} error={errors?.bathrooms} />
          <FormInput label="Vagas de Garagem" type="number" value={garageSpaces} onChange={v => setGarageSpaces(Number(v))} error={errors?.garageSpaces} />
          <FormInput label="Área" type="text" value={area} onChange={v => setArea(v)} error={errors?.area} />
          <FormInput label="Cidade" value={city} onChange={setCity} error={errors?.city} placeholder="Ex: Aracaju" />
          <FormInput label="Bairro" value={neighborhood} onChange={setNeighborhood} error={errors?.neighborhood} placeholder="Ex: Centro" />
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={active}
                onChange={e => setActive(e.target.checked)}
              />
              Ativo
            </label>
          </div>
          <Button type="submit">Criar</Button>
        </form>
      </Card>
    </AdminLayout>
  )
}

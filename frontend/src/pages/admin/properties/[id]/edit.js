import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'
import { propertyService } from '@/services/propertyService'
import FormInput from '@/components/FormInput'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import SortableImage from '@/components/SortableImage'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function EditProperty() {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])

  const load = async () => {
    if (!id) return
    const res = await propertyService.getById(id)
    setProperty(res.data)
    setTitle(res.data.title)
    setPrice(res.data.price)
    setDescription(res.data.description || '')
    setImages(res.data.images || [])
  }

  useEffect(() => { load() }, [id])

  const [errors, setErrors] = useState({})

  const save = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!title) errs.title = 'Título é obrigatório'
    if (price <= 0) errs.price = 'Preço deve ser maior que zero'
    setErrors(errs)
    if (Object.keys(errs).length) return
    await propertyService.update(id, { title, description, price, bedrooms: property.bedrooms, bathrooms: property.bathrooms, garageSpaces: property.garageSpaces, area: property.area, city: property.city, neighborhood: property.neighborhood, active: property.active || true })
    alert('Salvo')
  }

  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await propertyService.uploadImage(id, file)
    setImages(prev => [...prev, { id: res.data.id, fileName: res.data.fileName }])
  }

  const removeImage = async (imageId) => {
    if (!confirm('Remover imagem?')) return
    await propertyService.deleteImage(id, imageId)
    setImages(prev => prev.filter(i => i.id !== imageId))
  }

  const setMainImage = async (imageId) => {
    await propertyService.setMainImage(id, imageId)
    setImages(prev => prev.map(i => ({ ...i, isMain: i.id === imageId })))
  }

  const handleDragEnd = async (event) => {
    if (event.canceled) return

    setImages((images) => move(images, event))

    const newOrder = move(images, event).map(img => img.id)
    await propertyService.orderImages(id, newOrder)
  }

  if (!property) return <AdminLayout><div>Carregando...</div></AdminLayout>

  return (
    <AdminLayout>
      <h1>Editar Imóvel #{id}</h1>
      <Card>
        <form onSubmit={save}>
          <FormInput label="Título" value={title} onChange={setTitle} error={errors.title} />
          <FormInput label="Preço" type="number" value={price} onChange={v => setPrice(Number(v))} error={errors.price} />
          <FormInput label="Descrição" textarea value={description} onChange={setDescription} />
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </form>
      </Card>

      <section>
        <h2>Imagens</h2>
        <input type="file" onChange={upload} />
        <DragDropProvider onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {images.map((img, index) => (
              <SortableImage key={img.id} id={img.id} index={index}>
                <Card className="p-2 w-40">
                  {img.isMain === true && <Badge status="ativo">Imagem Principal</Badge>}
                  <img
                    src={(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/uploads/' + img.fileName}
                    alt=""
                    className="w-full h-20 object-cover rounded-md my-2"
                  />
                  <div className="flex flex-col gap-1">
                    <Button variant="secondary" onClick={() => removeImage(img.id)}>
                      Remover
                    </Button>
                    <Button variant="primary" onClick={() => setMainImage(img.id)}>
                      Definir como principal
                    </Button>
                  </div>
                </Card>
              </SortableImage>
            ))}
          </div>
        </DragDropProvider>
      </section>
    </AdminLayout>
  )
}

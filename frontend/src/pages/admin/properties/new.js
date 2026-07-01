import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'
import Router from 'next/router'
import FormInput from '@/components/FormInput'

export default function NewProperty(){
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState()
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  const submit = async (e)=>{
    e.preventDefault()
    if(!title) return alert('Título é obrigatório')
    if(price <= 0) return alert('Preço deve ser maior que zero')
    try{
      const res = await api().post('/api/properties', { title, description, price })
      Router.push('/admin/properties')
    }catch(err){
      alert(err?.response?.data?.error || 'Erro ao criar')
    }
  }

  return (
    <AdminLayout>
      <h1>Criar Imóvel</h1>
      <form onSubmit={submit}>
        <FormInput label="Título" value={title} onChange={setTitle} error={errors?.title} />
        <FormInput label="Preço" type="number" value={price} onChange={v=>setPrice(Number(v))} error={errors?.price} />
        <FormInput label="Descrição" textarea value={description} onChange={setDescription} />
        <button type="submit">Criar</button>
      </form>
    </AdminLayout>
  )
}

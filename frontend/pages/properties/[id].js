import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function PropertyPage(){
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)

  useEffect(()=>{
    if(!id) return
    axios.get(`/api/properties/${id}`, { baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' })
      .then(res=>setProperty(res.data))
  },[id])

  if(!property) return <div>Carregando...</div>

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>Preço: R$ {property.price}</p>
    </div>
  )
}

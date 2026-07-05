import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import FormInput from '../components/FormInput'
import Layout from '@/components/Layout'
import Button from '@/components/ui/Button'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const submit = async (ev) => {
    ev.preventDefault()
    const errs = {}
    if(!name) errs.name = 'Nome é obrigatório'
    if(!email) errs.email = 'Email é obrigatório'
    if(!password) errs.password = 'Senha é obrigatória'
    if(password && password.length < 6) errs.password = 'Senha deve ter ao menos 6 caracteres'
    setErrors(errs)
    if(Object.keys(errs).length) return
    try{
      await axios.post('/api/auth/register', { name, email, password }, { baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' })
      Router.push('/login')
    }catch(err){
      setErrors({ form: err?.response?.data?.error || 'Registro falhou' })
    }
  }

  return (
    <Layout>
      <div>
        <h1>Registrar</h1>
        <form onSubmit={submit}>
          <FormInput label="Nome" value={name} onChange={setName} error={errors.name} />
          <FormInput label="Email" value={email} onChange={setEmail} error={errors.email} />
          <FormInput label="Senha" type="password" value={password} onChange={setPassword} error={errors.password} />
          {errors.form && <div style={{ color: 'red' }}>{errors.form}</div>}
          <Button variant="primary" type="submit">
            Registrar
          </Button>
        </form>
      </div>
    </Layout>
  )
}

import { useState } from 'react'
import axios from 'axios'
import FormInput from '../components/FormInput'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const submit = async (ev) => {
    ev.preventDefault()
    const errs = {}
    if(!email) errs.email = 'Email é obrigatório'
    if(!password) errs.password = 'Senha é obrigatória'
    setErrors(errs)
    if(Object.keys(errs).length) return
    try{
      const res = await axios.post('/api/auth/login', { email, password }, { baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' })
      const token = res.data.token
      login(token)
    }catch(err){
      setErrors({ form: err?.response?.data?.error || 'Login falhou' })
    }
  }

  return (
    <Layout>
      <div>
        <h1>Login</h1>
        <form onSubmit={submit}>
          <FormInput label="Email" value={email} onChange={setEmail} error={errors.email} />
          <FormInput label="Senha" type="password" value={password} onChange={setPassword} error={errors.password} />
          {errors.form && <div style={{ color: 'red' }}>{errors.form}</div>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </Layout>
  )
}

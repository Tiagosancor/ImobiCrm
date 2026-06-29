import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function api(){
  let token = null
  if (typeof window !== 'undefined') token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  return axios.create({ baseURL: API_URL, headers })
}

export default api

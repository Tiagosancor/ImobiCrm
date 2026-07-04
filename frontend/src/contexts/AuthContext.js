import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
            setLoading(false)
        } else {
            api().get('/api/auth/me')
                .then(res => {
                    setUser(res.data)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
        }
    }, [])

    const login = (token) => {
        localStorage.setItem('token', token)
        api().get('/api/auth/me')
            .then(res => {
                setUser(res.data)
                router.push('/admin/properties')
            })
    }

    const logout = () => {
        localStorage.removeItem('token')
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}


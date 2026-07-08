import { api } from '@/lib/api'

export const authService = {
    register: (data) => api().post('/api/auth/register', data),
    login: (data) => api().post('/api/auth/login', data),
    getCurrentUser: () => api().get('/api/auth/me'),
    changePassword: (data) => api().post('/api/auth/change-password', data),
    recoverPassword: (data) => api().post('/api/auth/recover', data),
    resetPassword: (data) => api().post('/api/auth/reset', data)
}
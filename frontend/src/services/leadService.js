import { api } from '@/lib/api'

export const leadService = {
    list: (params) => api().get('/api/leads', {params}),
    getById: (id) => api().get(`/api/leads/${id}`),
    create: (data) => api().post('/api/leads', data),
    update: (id, data) => api().put(`/api/leads/${id}`, data),
    changeStatus: (id, status) => api().put(`/api/leads/${id}/status`, { status })
}

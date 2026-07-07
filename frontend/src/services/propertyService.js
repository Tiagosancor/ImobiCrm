import { api } from '@/lib/api'

export const propertyService = {
    list: (params) => api().get('/api/properties', {params}),
    listAdmin: (params) => api().get('/api/properties/admin', {params}),
    getById: (id) => api().get(`/api/properties/${id}`),
    create: (data) => api().post('/api/properties', data),
    update: (id, data) => api().put(`/api/properties/${id}`, data),
    delete: (id) => api().delete(`/api/properties/${id}`),
    activate: (id) => api().post(`/api/properties/${id}/activate`),
    deactivate: (id) => api().post(`/api/properties/${id}/deactivate`),
    uploadImage: (id, file) => {
        const fd = new FormData()
        fd.append('file', file)
        return api().post(`/api/properties/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    deleteImage: (propertyId, imageId) => api().delete(`/api/properties/${propertyId}/images/${imageId}`),
    setMainImage: (propertyId, imageId) => api().put(`/api/properties/${propertyId}/images/${imageId}/main`),
    orderImages: (propertyId, imageIds) => api().put(`/api/properties/${propertyId}/images/order`, { imageIds })
}
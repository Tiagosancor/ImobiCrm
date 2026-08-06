import { api } from '@/lib/api'

export const clientService = {
    list: (params) => api().get('/api/clients', {params}),
    getById: (id) => api().get(`/api/clients/${id}`),
    create: (data) => api().post('/api/clients', data),
    update: (id, data) => api().put(`/api/clients/${id}`, data),
    activate: (id) => api().post(`/api/clients/${id}/activate`),
    deactivate: (id) => api().post(`/api/clients/${id}/deactivate`),
    listPhones: (id) => api().get(`/api/clients/${id}/phones`),
    addPhone: (id, data) => api().post(`/api/clients/${id}/phones`, data),
    updatePhone: (id, phoneId, data) => api().put(`/api/clients/${id}/phones/${phoneId}`, data),
    removePhone: (id, phoneId) => api().delete(`/api/clients/${id}/phones/${phoneId}`),
    listEmails: (id) => api().get(`/api/clients/${id}/emails`),
    addEmail: (id, data) => api().post(`/api/clients/${id}/emails`, data),
    updateEmail: (id, emailId, data) => api().put(`/api/clients/${id}/emails/${emailId}`, data),
    removeEmail: (id, emailId) => api().delete(`/api/clients/${id}/emails/${emailId}`),
    listAddresses: (id) => api().get(`/api/clients/${id}/addresses`),
    addAddress: (id, data) => api().post(`/api/clients/${id}/addresses`, data),
    updateAddress: (id, addressId, data) => api().put(`/api/clients/${id}/addresses/${addressId}`, data),
    removeAddress: (id, addressId) => api().delete(`/api/clients/${id}/addresses/${addressId}`),
    listServiceHistory: (id) => api().get(`/api/clients/${id}/service-history`),
    addServiceHistory: (id, data) => api().post(`/api/clients/${id}/service-history`, data),
    listClientProperties: (id) => api().get(`/api/clients/${id}/properties`),
    addClientProperty: (clientId, propertyId, data) => api().post(`/api/clients/${clientId}/properties/${propertyId}`, data),
    updateClientProperty: (clientId, propertyId, data) => api().put(`/api/clients/${clientId}/properties/${propertyId}`, data),
    removeClientProperty: (clientId, propertyId) => api().delete(`/api/clients/${clientId}/properties/${propertyId}`)
}
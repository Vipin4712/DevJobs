import api from './axios.js'

export const fetchStats = () => api.get('/admin/stats')
export const fetchAllUsers = (params) => api.get('/admin/users', { params })
export const updateUserStatus = (id, data) => api.patch(`/admin/users/${id}`, data)
export const fetchAllJobsAdmin = (params) => api.get('/admin/jobs', { params })
export const deleteJobAdmin = (id) => api.delete(`/admin/jobs/${id}`)
import api from './axios.js'

export const fetchJobs = (params) => api.get('/jobs', { params })
export const fetchJobById = (id) => api.get(`/jobs/${id}`)
export const fetchMyJobs = () => api.get('/jobs/mine')
export const createJob = (data) => api.post('/jobs', data)
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)
export const deleteJob = (id) => api.delete(`/jobs/${id}`)
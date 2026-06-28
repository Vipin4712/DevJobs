import api from './axios.js'

export const generateMatch = (jobId) => api.post(`/match/${jobId}`)
export const fetchCachedMatch = (jobId) => api.get(`/match/${jobId}`)
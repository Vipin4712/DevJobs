import api from './axios.js'

export const applyToJob = (jobId) => api.post(`/applications/${jobId}`)
export const fetchMyApplications = () => api.get('/applications/mine')
export const fetchApplicantsForJob = (jobId) => api.get(`/applications/job/${jobId}`)
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status })
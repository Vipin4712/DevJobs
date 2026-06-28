import api from './axios.js'

export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append('resume', file)
  return api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const fetchResumeInfo = () => api.get('/resume/info')
export const updateManualSkills = (manualSkills) =>
  api.patch('/resume/manual-skills', { manualSkills })
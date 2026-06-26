import { createSlice } from '@reduxjs/toolkit'

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    filters: { skills: '', location: '', type: '', minSalary: '', search: '' },
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs
      state.total = action.payload.total
      state.page = action.payload.page
      state.totalPages = action.payload.totalPages
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const { setJobs, setLoading, setFilters } = jobSlice.actions
export default jobSlice.reducer
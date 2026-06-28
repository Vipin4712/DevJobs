import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs } from '../api/jobApi.js'
import { setJobs, setLoading, setFilters } from '../store/jobSlice.js'
import JobCard from '../components/JobCard.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import RecommendedJobs from '../components/RecommendedJobs.jsx'

function BrowseJobs() {
  const dispatch = useDispatch()
  const { jobs, total, page, totalPages, loading, filters } = useSelector((state) => state.jobs)

  const loadJobs = async (params = {}, pageNum = 1) => {
    dispatch(setLoading(true))
    try {
      const res = await fetchJobs({ ...params, page: pageNum, limit: 6 })
      dispatch(setJobs(res.data))
    } catch (err) {
      console.error(err)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    loadJobs(filters, 1)
  }, [])

  const handleApplyFilters = (newFilters) => {
    dispatch(setFilters(newFilters))
    loadJobs(newFilters, 1)
  }

  const goToPage = (p) => {
    loadJobs(filters, p)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <RecommendedJobs />
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Browse jobs</h1>
      <p className="text-sm text-gray-500 mb-6">{total} jobs found</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar filters={filters} onApply={handleApplyFilters} />
        </div>

        <div className="md:col-span-3">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>No jobs match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 text-sm rounded-md ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowseJobs
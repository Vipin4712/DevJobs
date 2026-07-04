import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { fetchJobById } from '../api/jobApi.js'
import { applyToJob, fetchMyApplications } from '../api/applicationApi.js'

function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchJobById(id)
        setJob(res.data.job)

        // check if seeker already applied to this job
        if (isAuthenticated && user.role === 'seeker') {
          const appsRes = await fetchMyApplications()
          const applied = appsRes.data.applications.some((app) => app.job._id === id)
          setHasApplied(applied)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isAuthenticated])

  const handleApply = async () => {
    setApplying(true)
    try {
      await applyToJob(id)
      toast.success('Application submitted!')
      setHasApplied(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>
  if (!job) return <p className="text-center py-16 text-gray-500">Job not found</p>

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Not disclosed'
    return `₹${(job.salaryMin / 100000).toFixed(0)}L – ₹${(job.salaryMax / 100000).toFixed(0)}L per year`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/jobs" className="text-sm text-blue-600 hover:underline">← Back to jobs</Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">
              {job.company} · {job.location} · {job.type}
            </p>
          </div>
          <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
            {job.status}
          </span>
        </div>

        <p className="text-base font-medium text-gray-900 mt-4">{formatSalary()}</p>

        <div className="flex gap-2 flex-wrap mt-4">
          {job.skills.map((skill) => (
            <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h2 className="font-medium text-gray-900 mb-2">Job description</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>

        {isAuthenticated && user.role === 'seeker' && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            {hasApplied ? (
              <span className="text-sm px-5 py-2.5 rounded-md bg-green-50 text-green-700 border border-green-200">
                ✓ Application submitted
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying || job.status === 'closed'}
                className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Apply now'}
              </button>
            )}
            <Link
              to={`/jobs/${job._id}/match`}
              className="border border-gray-300 text-sm px-5 py-2.5 rounded-md hover:bg-gray-50"
            >
              Check my match score
            </Link>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Login to apply for this job →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail
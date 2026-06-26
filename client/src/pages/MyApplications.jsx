import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyApplications } from '../api/applicationApi.js'
import StatusBadge from '../components/StatusBadge.jsx'

function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMyApplications()
        setApplications(res.data.applications)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatSalary = (job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Not disclosed'
    return `₹${(job.salaryMin / 100000).toFixed(0)}L – ₹${(job.salaryMax / 100000).toFixed(0)}L`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">My applications</h1>
      <p className="text-sm text-gray-500 mb-6">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Browse open jobs →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <Link to={`/jobs/${app.job._id}`} className="font-medium text-gray-900 hover:underline">
                  {app.job.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {app.job.company} · {app.job.location} · {formatSalary(app.job)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyApplications
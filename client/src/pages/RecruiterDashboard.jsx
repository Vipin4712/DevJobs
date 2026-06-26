import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchMyJobs, deleteJob } from '../api/jobApi.js'

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const loadJobs = async () => {
    try {
      const res = await fetchMyJobs()
      setJobs(res.data.jobs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return
    try {
      await deleteJob(id)
      toast.success('Job deleted')
      setJobs(jobs.filter((j) => j._id !== id))
    } catch (err) {
      toast.error('Failed to delete job')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My job postings</h1>
        <Link
          to="/recruiter/post-job"
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Post new job
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{job.title}</p>
                <p className="text-sm text-gray-500">
                  {job.location} · {job.type} ·{' '}
                  <span className={job.status === 'open' ? 'text-green-600' : 'text-gray-400'}>
                    {job.status}
                  </span>
                  {' '}· {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/recruiter/job/${job._id}/applicants`}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Applicants ({job.applicantCount})
                </Link>
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  View
                </Link>
                <Link
                  to={`/recruiter/edit-job/${job._id}`}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecruiterDashboard
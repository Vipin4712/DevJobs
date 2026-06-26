import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchApplicantsForJob, updateApplicationStatus } from '../api/applicationApi.js'
import StatusBadge from '../components/StatusBadge.jsx'

function JobApplicants() {
  const { jobId } = useParams()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadApplicants = async () => {
    try {
      const res = await fetchApplicantsForJob(jobId)
      setApplications(res.data.applications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplicants()
  }, [jobId])

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId)
    try {
      await updateApplicationStatus(applicationId, newStatus)
      toast.success(`Marked as ${newStatus}`)
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/recruiter/dashboard" className="text-sm text-blue-600 hover:underline">← Back to dashboard</Link>

      <h1 className="text-2xl font-semibold text-gray-900 mt-4 mb-1">Applicants</h1>
      <p className="text-sm text-gray-500 mb-6">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No applicants yet for this job.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{app.applicant.name}</p>
                  <p className="text-sm text-gray-500">{app.applicant.email}</p>
                  {app.applicant.location && (
                    <p className="text-sm text-gray-500">{app.applicant.location}</p>
                  )}
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.applicant.parsedSkills?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {app.applicant.parsedSkills.map((skill) => (
                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                {app.applicant.resumeUrl ? (
                  
                    <a href={app.applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View resume →
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">No resume uploaded</span>
                )}

                <div className="flex gap-2">
                  <select
                    value={app.status}
                    disabled={updatingId === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1.5"
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default JobApplicants
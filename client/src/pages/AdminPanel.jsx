import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  fetchStats,
  fetchAllUsers,
  updateUserStatus,
  fetchAllJobsAdmin,
  deleteJobAdmin,
} from '../api/adminApi.js'

function AdminPanel() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetchStats()
      setStats(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await fetchAllUsers({ limit: 50 })
      setUsers(res.data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async () => {
    setLoading(true)
    try {
      const res = await fetchAllJobsAdmin({ limit: 50 })
      setJobs(res.data.jobs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    if (newTab === 'users' && users.length === 0) loadUsers()
    if (newTab === 'jobs' && jobs.length === 0) loadJobs()
  }

  const handleBanToggle = async (user) => {
    try {
      await updateUserStatus(user._id, { isBanned: !user.isBanned })
      toast.success(user.isBanned ? 'User unbanned' : 'User banned')
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isBanned: !u.isBanned } : u))
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserStatus(userId, { role: newRole })
      toast.success('Role updated')
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role')
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return
    try {
      await deleteJobAdmin(jobId)
      toast.success('Job deleted')
      setJobs((prev) => prev.filter((j) => j._id !== jobId))
    } catch (err) {
      toast.error('Failed to delete job')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Panel</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['overview', 'users', 'jobs'].map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-4 py-2 text-sm capitalize border-b-2 ${
              tab === t ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats && [
            { label: 'Total users', value: stats.totalUsers },
            { label: 'Job seekers', value: stats.totalSeekers },
            { label: 'Recruiters', value: stats.totalRecruiters },
            { label: 'Total jobs', value: stats.totalJobs },
            { label: 'Open jobs', value: stats.openJobs },
            { label: 'Applications', value: stats.totalApplications },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            users.map((u) => (
              <div key={u._id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1.5"
                  >
                    <option value="seeker">Seeker</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleBanToggle(u)}
                    className={`text-sm px-3 py-1.5 rounded-md border ${
                      u.isBanned
                        ? 'border-green-200 text-green-600 hover:bg-green-50'
                        : 'border-red-200 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'jobs' && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.company} · Posted by {job.postedBy?.name || 'Unknown'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPanel
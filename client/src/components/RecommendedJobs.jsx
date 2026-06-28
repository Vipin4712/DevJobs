import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchJobs } from '../api/jobApi.js'
import { fetchResumeInfo } from '../api/resumeApi.js'
import JobCard from './JobCard.jsx'

function RecommendedJobs() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || user.role !== 'seeker') {
        setLoading(false)
        return
      }

      try {
        const [resumeRes, jobsRes] = await Promise.all([
          fetchResumeInfo(),
          fetchJobs({ limit: 50 }),
        ])

        const candidateSkills = [
          ...(resumeRes.data.resumeInfo.parsedSkills || []),
          ...(resumeRes.data.resumeInfo.manualSkills || []),
        ].map((s) => s.toLowerCase())

        if (candidateSkills.length === 0) {
          setLoading(false)
          return
        }

        const scored = jobsRes.data.jobs
          .map((job) => {
            const jobSkills = job.skills.map((s) => s.toLowerCase())
            const overlap = jobSkills.filter((s) => candidateSkills.includes(s)).length
            const overlapPercent = jobSkills.length > 0 ? overlap / jobSkills.length : 0
            return { ...job, overlapPercent }
          })
          .filter((job) => job.overlapPercent > 0)
          .sort((a, b) => b.overlapPercent - a.overlapPercent)
          .slice(0, 4)

        setRecommended(scored)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  if (!isAuthenticated || user?.role !== 'seeker' || loading || recommended.length === 0) {
    return null 
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Jobs that match your resume</h2>
      <p className="text-sm text-gray-500 mb-4">Based on the skills detected in your profile</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommended.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  )
}

export default RecommendedJobs
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { generateMatch, fetchCachedMatch } from '../api/matchApi.js'
import { fetchJobById } from '../api/jobApi.js'
import MatchScoreRing from '../components/MatchScoreRing.jsx'

function MatchScore() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const jobRes = await fetchJobById(id)
        setJob(jobRes.data.job)

        // try to load a cached score first (instant, no API cost)
        try {
          const cachedRes = await fetchCachedMatch(id)
          setMatch(cachedRes.data)
        } catch {
          // no cached score yet — that's fine, user can generate one
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateMatch(id)
      setMatch(res.data)
      toast.success('Match score generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate match score')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>
  if (!job) return <p className="text-center py-16 text-gray-500">Job not found</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to={`/jobs/${id}`} className="text-sm text-blue-600 hover:underline">← Back to job</Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
        <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{job.company} · {job.location}</p>

        {!match ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-4">
              Get an AI-powered analysis of how well your profile matches this job.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 text-white text-sm px-6 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? 'Analyzing your profile...' : 'Check my match score'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-6">
              <MatchScoreRing score={match.matchScore} />
            </div>

            {match.strengths?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Your strengths</h3>
                <ul className="space-y-1">
                  {match.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-green-600">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.missingSkills?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Skills you're missing</h3>
                <div className="flex gap-2 flex-wrap">
                  {match.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.suggestion && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-900">💡 {match.suggestion}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="text-sm text-gray-500 hover:text-gray-700 mt-5"
            >
              {generating ? 'Refreshing...' : '↻ Refresh match score'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchScore
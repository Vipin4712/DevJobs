import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { fetchResumeInfo, updateManualSkills } from '../api/resumeApi.js'
import ResumeUpload from '../components/ResumeUpload.jsx'
import SkillTag from '../components/SkillTag.jsx'

function SeekerProfile() {
  const { user } = useSelector((state) => state.auth)
  const [resumeInfo, setResumeInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState('')
  const [savingSkills, setSavingSkills] = useState(false)

  const loadResumeInfo = async () => {
    try {
      const res = await fetchResumeInfo()
      setResumeInfo(res.data.resumeInfo)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResumeInfo()
  }, [])

  const handleUploadSuccess = (data) => {
    setResumeInfo((prev) => ({
      ...prev,
      resumeUrl: data.resumeUrl,
      parsedSkills: data.parsedSkills,
      experienceYears: data.experienceYears,
    }))
  }

  const handleAddManualSkill = async () => {
    const trimmed = newSkill.trim()
    if (!trimmed) return

    const current = resumeInfo.manualSkills || []
    if (current.includes(trimmed)) {
      toast.error('Skill already added')
      return
    }

    const updated = [...current, trimmed]
    setSavingSkills(true)
    try {
      await updateManualSkills(updated)
      setResumeInfo((prev) => ({ ...prev, manualSkills: updated }))
      setNewSkill('')
      toast.success('Skill added')
    } catch (err) {
      toast.error('Failed to add skill')
    } finally {
      setSavingSkills(false)
    }
  }

  const handleRemoveManualSkill = async (skillToRemove) => {
    const updated = resumeInfo.manualSkills.filter((s) => s !== skillToRemove)
    setSavingSkills(true)
    try {
      await updateManualSkills(updated)
      setResumeInfo((prev) => ({ ...prev, manualSkills: updated }))
      toast.success('Skill removed')
    } catch (err) {
      toast.error('Failed to remove skill')
    } finally {
      setSavingSkills(false)
    }
  }

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Profile</h1>
      <p className="text-sm text-gray-500 mb-6">{user.name} · {user.email}</p>

      {/* Resume Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-medium text-gray-900 mb-3">Resume</h2>
        <ResumeUpload
          currentResumeUrl={resumeInfo?.resumeUrl}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>

      {/* Parsed Info Section */}
      {resumeInfo?.resumeUrl && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-900">Skills extracted from resume</h2>
            <span className="text-xs text-gray-400">Auto-detected</span>
          </div>

          {resumeInfo.parsedSkills?.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {resumeInfo.parsedSkills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No skills detected from your resume.</p>
          )}

          <p className="text-sm text-gray-600 mt-4">
            Experience: <span className="font-medium">{resumeInfo.experienceYears || 0} years</span>
          </p>
        </div>
      )}

      {/* Manual Skills Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-gray-900">Additional skills</h2>
          <span className="text-xs text-gray-400">Added by you</span>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddManualSkill())}
            placeholder="e.g. Docker, AWS, GraphQL"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={handleAddManualSkill}
            disabled={savingSkills}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {resumeInfo?.manualSkills?.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {resumeInfo.manualSkills.map((skill) => (
              <SkillTag
                key={skill}
                skill={skill}
                removable
                onRemove={handleRemoveManualSkill}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No additional skills added yet.</p>
        )}
      </div>
    </div>
  )
}

export default SeekerProfile
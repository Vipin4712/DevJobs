import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createJob, updateJob, fetchJobById } from '../api/jobApi.js'

function PostJob() {
  const { id } = useParams()        // present only when editing
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    skills: '',
    location: '',
    type: 'full-time',
    salaryMin: '',
    salaryMax: '',
  })

  useEffect(() => {
    if (isEditMode) {
      fetchJobById(id).then((res) => {
        const job = res.data.job
        setFormData({
          ...job,
          skills: job.skills.join(', '),
        })
      })
    }
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      salaryMin: Number(formData.salaryMin) || 0,
      salaryMax: Number(formData.salaryMax) || 0,
    }

    try {
      if (isEditMode) {
        await updateJob(id, payload)
        toast.success('Job updated!')
      } else {
        await createJob(payload)
        toast.success('Job posted!')
      }
      navigate('/recruiter/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Edit job posting' : 'Post a new job'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Job title</label>
          <input
            type="text" name="title" value={formData.title} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Company name</label>
          <input
            type="text" name="company" value={formData.company} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Description</label>
          <textarea
            name="description" value={formData.description} onChange={handleChange} required rows={5}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Skills (comma separated)</label>
          <input
            type="text" name="skills" value={formData.skills} onChange={handleChange} required
            placeholder="React, Node.js, MongoDB"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Location</label>
          <input
            type="text" name="location" value={formData.location} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Job type</label>
          <select
            name="type" value={formData.type} onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Min salary (₹/yr)</label>
            <input
              type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Max salary (₹/yr)</label>
            <input
              type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 mt-2"
        >
          {isEditMode ? 'Update job' : 'Post job'}
        </button>
      </form>
    </div>
  )
}

export default PostJob
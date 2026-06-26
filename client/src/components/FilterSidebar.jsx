import { useState } from 'react'

function FilterSidebar({ filters, onApply }) {
  const [local, setLocal] = useState(filters)

  const handleChange = (e) => {
    setLocal({ ...local, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onApply(local)
  }

  const handleClear = () => {
    const cleared = { skills: '', location: '', type: '', minSalary: '', search: '' }
    setLocal(cleared)
    onApply(cleared)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 sticky top-20">
      <h3 className="font-medium text-gray-900">Filters</h3>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Search</label>
        <input
          type="text"
          name="search"
          value={local.search}
          onChange={handleChange}
          placeholder="Job title, skill..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={local.location}
          onChange={handleChange}
          placeholder="Remote, Bangalore..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={local.skills}
          onChange={handleChange}
          placeholder="React, Node.js"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Job type</label>
        <select
          name="type"
          value={local.type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Min salary (₹/yr)</label>
        <input
          type="number"
          name="minSalary"
          value={local.minSalary}
          onChange={handleChange}
          placeholder="500000"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 border border-gray-300 text-sm py-2 rounded-md hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </form>
  )
}

export default FilterSidebar
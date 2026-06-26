import { Link } from 'react-router-dom'

function JobCard({ job }) {
  const initials = job.company.slice(0, 2).toUpperCase()

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Not disclosed'
    return `₹${(job.salaryMin / 100000).toFixed(0)}L – ₹${(job.salaryMax / 100000).toFixed(0)}L`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center font-medium text-sm text-blue-700">
            {initials}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-base">{job.title}</h3>
            <p className="text-sm text-gray-500">
              {job.company} · {job.location} · {job.type}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-3">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-900">{formatSalary()}</span>
        <Link
          to={`/jobs/${job._id}`}
          className="text-sm px-3.5 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          View details
        </Link>
      </div>
    </div>
  )
}

export default JobCard
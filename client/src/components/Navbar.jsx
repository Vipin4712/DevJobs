import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { logoutUser } from '../api/authApi.js'
import { logout } from '../store/authSlice.js'

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(logout())
      toast.success('Logged out')
      navigate('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/jobs" className="text-xl font-semibold text-gray-900">
          Dev<span className="text-blue-600">Jobs</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">
            Browse Jobs
          </Link>

          {isAuthenticated && user.role === 'recruiter' && (
            <>
              <Link to="/recruiter/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                My Postings
              </Link>
              <Link
                to="/recruiter/post-job"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Post a Job
              </Link>
            </>
          )}

          {isAuthenticated && user.role === 'seeker' && (
            <Link to="/applications" className="text-sm text-gray-600 hover:text-gray-900">
              My Applications
            </Link>
          )}

          {isAuthenticated && user.role === 'admin' && (
            <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
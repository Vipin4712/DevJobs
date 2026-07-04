import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { logoutUser } from '../api/authApi.js'
import { logout } from '../store/authSlice.js'

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(logout())
      toast.success('Logged out')
      navigate('/login')
      setMenuOpen(false)
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/jobs" className="text-xl font-semibold text-gray-900 shrink-0">
          Dev<span className="text-blue-600">Jobs</span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">
            Browse Jobs
          </Link>

          {isAuthenticated && user.role === 'seeker' && (
            <>
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                Profile
              </Link>
              <Link to="/applications" className="text-sm text-gray-600 hover:text-gray-900">
                My Applications
              </Link>
            </>
          )}

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

        {/* Mobile hamburger button — visible only on small screens */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <Link
            to="/jobs"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-600 hover:text-gray-900 py-1"
          >
            Browse Jobs
          </Link>

          {isAuthenticated && user.role === 'seeker' && (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                Profile
              </Link>
              <Link
                to="/applications"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                My Applications
              </Link>
            </>
          )}

          {isAuthenticated && user.role === 'recruiter' && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                My Postings
              </Link>
              <Link
                to="/recruiter/post-job"
                onClick={() => setMenuOpen(false)}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
              >
                Post a Job
              </Link>
            </>
          )}

          {isAuthenticated && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-900 py-1"
            >
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm border border-gray-300 py-2 rounded-md hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
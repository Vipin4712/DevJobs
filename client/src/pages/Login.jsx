import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { loginUser } from '../api/authApi.js'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice.js'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const res = await loginUser(formData)
      dispatch(loginSuccess(res.data.user))
      toast.success('Welcome back!')

      if (res.data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard')
      } else if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      dispatch(loginFailure(message))
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../api/authApi.js'
import { loginSuccess } from '../store/authSlice.js'

export const useAuth = () => {
  const [checking, setChecking] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser()
        dispatch(loginSuccess(res.data.user))
      } catch (err) {
        // not logged in — that's fine, just stay logged out
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [dispatch])

  return { checking }
}
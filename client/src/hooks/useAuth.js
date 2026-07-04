import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from '../api/authApi.js'
import { loginSuccess, logout } from '../store/authSlice.js'

export const useAuth = () => {
  const [checking, setChecking] = useState(true)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setChecking(false)
        return
      }
      try {
        const res = await getCurrentUser()
        dispatch(loginSuccess({ user: res.data.user, token }))
      } catch (err) {
        // token expired or invalid — clear it
        dispatch(logout())
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [])

  return { checking }
}
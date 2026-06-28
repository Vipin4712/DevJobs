import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth.js'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import BrowseJobs from './pages/BrowseJobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import PostJob from './pages/PostJob.jsx'
import RecruiterDashboard from './pages/RecruiterDashboard.jsx'
import MyApplications from './pages/MyApplications.jsx'
import JobApplicants from './pages/JobApplicants.jsx'
import SeekerProfile from './pages/SeekerProfile.jsx'
import MatchScore from './pages/MatchScore.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

function App() {
  const { checking } = useAuth()

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/" element={<BrowseJobs />} />

        <Route path="/recruiter/dashboard" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/post-job" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/edit-job/:id" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <PostJob />
          </ProtectedRoute>
        } />
        
        <Route path="/applications" element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <MyApplications />
          </ProtectedRoute>
        } />

        <Route path="/recruiter/job/:jobId/applicants" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <JobApplicants />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <SeekerProfile />
          </ProtectedRoute>
        } />

        <Route path="/jobs/:id/match" element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <MatchScore />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
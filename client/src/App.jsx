import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Landing from './pages/public/Landing'
import Jobs from './pages/public/Jobs'
import JobDetail from './pages/public/JobDetail'
import Companies from './pages/public/Companies'
import CompanyDetail from './pages/public/CompanyDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateProfile from './pages/candidate/Profile'
import CandidateApplications from './pages/candidate/Applications'
import SavedJobs from './pages/candidate/SavedJobs'
import AdminDashboard from './pages/admin/Dashboard'
import AdminJobs from './pages/admin/AdminJobs'
import CreateJob from './pages/admin/CreateJob'
import EditJob from './pages/admin/EditJob'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminCandidates from './pages/admin/AdminCandidates'
import AdminApplications from './pages/admin/AdminApplications'
import AdminSettings from './pages/admin/AdminSettings'
import ProtectedRoute from './components/shared/ProtectedRoute'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { user } = useAuthStore()
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:id" element={<CompanyDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="dashboard/*" element={
          <ProtectedRoute roles={['CANDIDATE']}>
            <Routes>
              <Route index element={<CandidateDashboard />} />
              <Route path="profile" element={<CandidateProfile />} />
              <Route path="applications" element={<CandidateApplications />} />
              <Route path="saved-jobs" element={<SavedJobs />} />
            </Routes>
          </ProtectedRoute>
        } />
        <Route path="admin/*" element={
          <ProtectedRoute roles={['ADMIN']}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="jobs/new" element={<CreateJob />} />
              <Route path="jobs/:id/edit" element={<EditJob />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="candidates" element={<AdminCandidates />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

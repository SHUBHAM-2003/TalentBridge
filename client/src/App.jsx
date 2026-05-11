import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Landing from './pages/public/Landing'
import Jobs from './pages/public/Jobs'
import JobDetail from './pages/public/JobDetail'
import Companies from './pages/public/Companies'
import CompanyDetail from './pages/public/CompanyDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:id" element={<CompanyDetail />} />
      </Route>
    </Routes>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, FileText, CheckCircle, Plus } from 'lucide-react'
import { getStats, getUsers, getApplications } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ jobs: 0, companies: 8, candidates: 0, applications: 0 })

  useEffect(() => {
    const s = getStats()
    const candidates = getUsers().filter(u => u.role === 'CANDIDATE')
    const apps = getApplications()
    setStats({ ...s, candidates: candidates.length, applications: apps.length })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/jobs/new"><Button><Plus className="h-4 w-4 mr-2" />Post New Job</Button></Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card><CardContent className="p-6"><Briefcase className="h-8 w-8 text-blue-600 mb-4" /><div className="text-2xl font-bold">{stats.jobs}</div><div className="text-sm text-gray-500">Active Jobs</div></CardContent></Card>
        <Card><CardContent className="p-6"><Users className="h-8 w-8 text-purple-600 mb-4" /><div className="text-2xl font-bold">{stats.candidates}</div><div className="text-sm text-gray-500">Candidates</div></CardContent></Card>
        <Card><CardContent className="p-6"><FileText className="h-8 w-8 text-orange-600 mb-4" /><div className="text-2xl font-bold">{stats.applications}</div><div className="text-sm text-gray-500">Applications</div></CardContent></Card>
        <Card><CardContent className="p-6"><CheckCircle className="h-8 w-8 text-green-600 mb-4" /><div className="text-2xl font-bold">0</div><div className="text-sm text-gray-500">Hired</div></CardContent></Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardContent className="p-6"><h3 className="font-semibold mb-4">Quick Actions</h3><div className="grid grid-cols-2 gap-3">
          <Link to="/admin/jobs/new"><Button variant="outline" className="h-auto py-4"><Briefcase className="h-5 w-5 mr-2" />Post Job</Button></Link>
          <Link to="/admin/companies"><Button variant="outline" className="h-auto py-4"><Users className="h-5 w-5 mr-2" />Companies</Button></Link>
          <Link to="/admin/applications"><Button variant="outline" className="h-auto py-4"><FileText className="h-5 w-5 mr-2" />Applications</Button></Link>
          <Link to="/admin/candidates"><Button variant="outline" className="h-auto py-4"><Users className="h-5 w-5 mr-2" />Candidates</Button></Link>
        </div></CardContent></Card>
        <Card><CardContent className="p-6"><h3 className="font-semibold mb-4">Recent Activity</h3><p className="text-gray-500 text-center py-8">Activity feed will appear here</p></CardContent></Card>
      </div>
    </div>
  )
}
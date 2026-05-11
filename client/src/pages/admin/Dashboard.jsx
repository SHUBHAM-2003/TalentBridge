import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, FileText, CheckCircle, Calendar, TrendingUp, Plus } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/overview').then(r => setStats(r.data.data)).catch(e => console.error(e)).finally(() => setLoading(false))
  }, [])

  const kpis = [
    { label: 'Total Jobs', value: stats?.totalJobs, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Jobs', value: stats?.activeJobs, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Candidates', value: stats?.totalCandidates, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Applications', value: stats?.totalApplications, icon: FileText, color: 'bg-orange-50 text-orange-600' },
    { label: 'Shortlisted', value: stats?.shortlisted, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Interviews', value: stats?.interviewsThisWeek, icon: Calendar, color: 'bg-pink-50 text-pink-600' },
    { label: 'Hired', value: stats?.hiredThisMonth, icon: CheckCircle, color: 'bg-teal-50 text-teal-600' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/jobs/new"><Button><Plus className="h-4 w-4 mr-2" />Post New Job</Button></Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}><CardContent className="p-6">
            <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center mb-4`}><Icon className="h-6 w-6" /></div>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : value || 0}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link to="/admin/jobs/new"><Button variant="outline" className="h-auto py-4"><Briefcase className="h-5 w-5 mr-2" />Post New Job</Button></Link>
            <Link to="/admin/companies"><Button variant="outline" className="h-auto py-4"><Users className="h-5 w-5 mr-2" />Add Company</Button></Link>
            <Link to="/admin/applications"><Button variant="outline" className="h-auto py-4"><FileText className="h-5 w-5 mr-2" />View Applications</Button></Link>
            <Link to="/admin/candidates"><Button variant="outline" className="h-auto py-4"><Users className="h-5 w-5 mr-2" />View Candidates</Button></Link>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent><p className="text-gray-500 text-center py-8">Activity feed will appear here</p></CardContent>
        </Card>
      </div>
    </div>
  )
}

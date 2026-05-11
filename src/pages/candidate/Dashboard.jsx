import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, Briefcase, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getApplications, getJobById } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CandidateDashboard() {
  const { user } = useAuthStore()
  const [applications, setApplications] = useState([])

  useEffect(() => {
    if (user) setApplications(getApplications().filter(a => a.candidateId === user.id))
  }, [user])

  const stats = [
    { label: 'Applications Sent', value: applications.length, color: 'bg-blue-50 text-blue-600' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'UNDER_REVIEW').length, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length, color: 'bg-purple-50 text-purple-600' },
    { label: 'Offers', value: applications.filter(a => a.status === 'HIRED').length, color: 'bg-emerald-50 text-emerald-600' }
  ]

  const completion = user ? Math.round(([user.fullName, user.phone, user.bio, user.skills?.length].filter(Boolean).length / 4) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8"><h1 className="text-2xl font-bold">Welcome, {user?.fullName || user?.email}!</h1><p className="text-gray-500">Here's what's happening with your job search</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-6">
            <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center mb-4`}><FileText className="h-6 w-6" /></div>
            <div className="text-2xl font-bold">{value}</div><div className="text-sm text-gray-500">{label}</div>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card><CardContent className="p-6">
            <h3 className="font-semibold mb-4">Recent Applications</h3>
            {applications.length === 0 ? (
              <div className="text-center py-8"><p className="text-gray-500 mb-4">No applications yet</p><Link to="/jobs"><Button>Browse Jobs</Button></Link></div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => {
                  const job = getJobById(app.jobId)
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div><h4 className="font-medium">{job?.title || 'Unknown Job'}</h4><p className="text-sm text-gray-500">{job?.company?.name}</p></div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'APPLIED' ? 'bg-blue-100 text-blue-700' : app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{app.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardContent className="p-6">
            <h3 className="font-semibold mb-4">Profile Completion</h3>
            <div className="relative h-32 w-32 mx-auto mb-4">
              <svg className="h-32 w-32 -rotate-90"><circle cx="64" cy="64" r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" /><circle cx="64" cy="64" r="56" fill="none" stroke="#1E40AF" strokeWidth="12" strokeDasharray={`${completion * 3.52} 352`} /></svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold">{completion}%</span></div>
            </div>
            <Link to="/dashboard/profile"><Button variant="outline" className="w-full"><User className="h-4 w-4 mr-2" />Edit Profile</Button></Link>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/jobs"><Button variant="ghost" className="w-full justify-start"><Briefcase className="h-4 w-4 mr-2" />Browse Jobs</Button></Link>
              <Link to="/dashboard/applications"><Button variant="ghost" className="w-full justify-start"><FileText className="h-4 w-4 mr-2" />My Applications</Button></Link>
              <Link to="/dashboard/saved-jobs"><Button variant="ghost" className="w-full justify-start"><Clock className="h-4 w-4 mr-2" />Saved Jobs</Button></Link>
            </div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  )
}
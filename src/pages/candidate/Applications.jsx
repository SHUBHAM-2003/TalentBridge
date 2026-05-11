import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getApplications, getJobById } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import toast from 'react-hot-toast'

export default function Applications() {
  const { user } = useAuthStore()
  const [applications, setApplications] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { if (user) setApplications(getApplications().filter(a => a.candidateId === user.id)) }, [user])

  const withdraw = (id) => {
    const data = JSON.parse(localStorage.getItem('talentbridge_data'))
    data.applications = data.applications.filter(a => a.id !== id)
    localStorage.setItem('talentbridge_data', JSON.stringify(data))
    toast.success('Application withdrawn')
    setApplications(getApplications().filter(a => a.candidateId === user.id))
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)
  const getBadge = (s) => {
    if (s === 'APPLIED') return { label: 'Applied', color: 'bg-blue-100 text-blue-700' }
    if (s === 'SHORTLISTED') return { label: 'Shortlisted', color: 'bg-green-100 text-green-700' }
    if (s === 'REJECTED') return { label: 'Rejected', color: 'bg-red-100 text-red-700' }
    return { label: s, color: 'bg-gray-100 text-gray-700' }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'APPLIED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('APPLIED')}>Applied</Button>
        <Button variant={filter === 'SHORTLISTED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('SHORTLISTED')}>Shortlisted</Button>
        <Button variant={filter === 'REJECTED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('REJECTED')}>Rejected</Button>
      </div>
      <Card><CardContent className="p-0">
        {filtered.length === 0 ? <div className="p-12 text-center text-gray-500">No applications found</div>
         : <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Job</th><th className="text-left p-4 font-medium text-sm">Company</th><th className="text-left p-4 font-medium text-sm">Applied</th><th className="text-left p-4 font-medium text-sm">Status</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead><tbody>{filtered.map(app => {
           const job = getJobById(app.jobId)
           const badge = getBadge(app.status)
           return <tr key={app.id} className="border-b hover:bg-gray-50"><td className="p-4"><Link to={`/jobs/${app.jobId}`} className="font-medium text-primary hover:underline">{job?.title}</Link></td><td className="p-4 text-gray-600">{job?.company?.name}</td><td className="p-4 text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span></td><td className="p-4"><div className="flex gap-2">
             <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>View</Button>
             {app.status === 'APPLIED' && <Button variant="ghost" size="sm" onClick={() => withdraw(app.id)}><Trash2 className="h-4 w-4" /></Button>}
           </div></td></tr>
         })}</tbody></table></div>}
      </CardContent></Card>
      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details">
        {selectedApp && (() => { const job = getJobById(selectedApp.jobId); const badge = getBadge(selectedApp.status); return <div className="space-y-4">
          <div><h4 className="font-medium">{job?.title}</h4><p className="text-gray-500">{job?.company?.name}</p></div>
          <div><span className="font-medium">Status: </span><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span></div>
          <div><span className="font-medium">Applied: </span>{new Date(selectedApp.appliedAt).toLocaleDateString()}</div>
          {selectedApp.coverLetter && <div><span className="font-medium">Cover Letter:</span><p className="mt-1 text-gray-600 text-sm">{selectedApp.coverLetter}</p></div>}
        </div> })()}
      </Modal>
    </div>
  )
}
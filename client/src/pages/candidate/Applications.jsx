import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Trash2 } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { formatDate } from '@/utils/helpers'
import { APPLICATION_STATUSES } from '@/constants/options'
import toast from 'react-hot-toast'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetch() }, [])
  const fetch = async () => {
    try { const { data } = await api.get('/applications/mine'); setApplications(data.data.applications || []) } catch (e) { console.error(e) }
    setLoading(false)
  }

  const withdraw = async (id) => {
    try { await api.delete(`/applications/${id}`); toast.success('Application withdrawn'); fetch() } catch (e) { toast.error('Failed to withdraw') }
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)
  const statusBadge = (status) => APPLICATION_STATUSES.find(s => s.value === status)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
        {APPLICATION_STATUSES.map(s => <Button key={s.value} variant={filter === s.value ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s.value)}>{s.label}</Button>)}
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? <div className="p-6 text-center">Loading...</div> : filtered.length === 0 ? <div className="p-12 text-center text-gray-500">No applications found</div>
           : <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Job</th><th className="text-left p-4 font-medium text-sm">Company</th><th className="text-left p-4 font-medium text-sm">Applied</th><th className="text-left p-4 font-medium text-sm">Status</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead><tbody>{filtered.map(app => {
             const badge = statusBadge(app.status)
             return <tr key={app.id} className="border-b hover:bg-gray-50"><td className="p-4"><Link to={`/jobs/${app.jobId}`} className="font-medium text-primary hover:underline">{app.job?.title}</Link></td><td className="p-4 text-gray-600">{app.job?.company?.name}</td><td className="p-4 text-gray-500">{formatDate(app.appliedAt)}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>{badge?.label}</span></td><td className="p-4"><div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>View</Button>
               {app.status === 'APPLIED' && <Button variant="ghost" size="sm" onClick={() => withdraw(app.id)}><Trash2 className="h-4 w-4" /></Button>}
             </div></td></tr>
           })}</tbody></table></div>}
        </CardContent>
      </Card>
      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details">
        {selectedApp && <div className="space-y-4">
          <div><h4 className="font-medium">{selectedApp.job?.title}</h4><p className="text-gray-500">{selectedApp.job?.company?.name}</p></div>
          <div><span className="font-medium">Status: </span><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(selectedApp.status)?.color}`}>{statusBadge(selectedApp.status)?.label}</span></div>
          <div><span className="font-medium">Applied: </span>{formatDate(selectedApp.appliedAt)}</div>
          {selectedApp.coverLetter && <div><span className="font-medium">Cover Letter:</span><p className="mt-1 text-gray-600 text-sm">{selectedApp.coverLetter}</p></div>}
        </div>}
      </Modal>
    </div>
  )
}

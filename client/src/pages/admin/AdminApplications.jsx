import { useEffect, useState } from 'react'
import { Search, Calendar, Download } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/utils/helpers'
import { APPLICATION_STATUSES } from '@/constants/options'
import toast from 'react-hot-toast'

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewLocation, setInterviewLocation] = useState('')

  useEffect(() => { fetch() }, [search, status])
  const fetch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status !== 'all') params.set('status', status)
      const { data } = await api.get(`/admin/applications?${params}`)
      setApplications(data.data.applications || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const openDetail = (app) => { setSelected(app); setNewStatus(app.status); setAdminNotes(app.adminNotes || '') }
  const updateStatus = async () => {
    try { await api.patch(`/admin/applications/${selected.id}/status`, { status: newStatus }); toast.success('Status updated'); fetch(); setSelected(null) } catch (e) { toast.error('Failed') }
  }
  const saveNotes = async () => {
    try { await api.put(`/admin/applications/${selected.id}/notes`, { adminNotes }); toast.success('Notes saved') } catch (e) { toast.error('Failed') }
  }
  const scheduleInterview = async () => {
    try { await api.post(`/admin/applications/${selected.id}/interview`, { scheduledAt: interviewDate, locationOrLink: interviewLocation }); toast.success('Interview scheduled'); setSelected(null) } catch (e) { toast.error('Failed') }
  }

  const getBadge = (s) => APPLICATION_STATUSES.find(b => b.value === s)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Applications</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="all">All Status</option>
          {APPLICATION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
        <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Candidate</th><th className="text-left p-4 font-medium text-sm">Job</th><th className="text-left p-4 font-medium text-sm">Company</th><th className="text-left p-4 font-medium text-sm">Applied</th><th className="text-left p-4 font-medium text-sm">Status</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr> : applications.length === 0 ? <tr><td colSpan={6} className="p-8 text-center">No applications</td></tr>
         : applications.map(app => {
           const badge = getBadge(app.status)
           return <tr key={app.id} className="border-b hover:bg-gray-50">
             <td className="p-4 font-medium">{app.candidate?.fullName}</td>
             <td className="p-4 text-gray-600">{app.job?.title}</td>
             <td className="p-4 text-gray-600">{app.job?.company?.name}</td>
             <td className="p-4 text-gray-500 text-sm">{formatDate(app.appliedAt)}</td>
             <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>{badge?.label}</span></td>
             <td className="p-4"><Button variant="ghost" size="sm" onClick={() => openDetail(app)}>View</Button></td>
           </tr>
         })}</tbody>
      </table></div></CardContent></Card>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Application Details" className="max-w-2xl">
        {selected && <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-sm text-gray-500">Candidate</span><p className="font-medium">{selected.candidate?.fullName}</p></div>
            <div><span className="text-sm text-gray-500">Email</span><p className="font-medium">{selected.candidate?.user?.email}</p></div>
            <div><span className="text-sm text-gray-500">Job</span><p className="font-medium">{selected.job?.title}</p></div>
            <div><span className="text-sm text-gray-500">Company</span><p className="font-medium">{selected.job?.company?.name}</p></div>
          </div>
          {selected.coverLetter && <div><span className="text-sm text-gray-500">Cover Letter</span><p className="text-gray-600 mt-1">{selected.coverLetter}</p></div>}
          <div><label className="text-sm font-medium">Update Status</label><div className="flex gap-2 mt-1"><Select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="flex-1">{APPLICATION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</Select><Button onClick={updateStatus}>Update</Button></div></div>
          <div><label className="text-sm font-medium">Admin Notes (private)</label><Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="mt-1" placeholder="Internal notes..." /><Button size="sm" variant="outline" onClick={saveNotes} className="mt-2">Save Notes</Button></div>
          <div className="border-t pt-4"><h4 className="font-medium mb-3">Schedule Interview</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className="text-sm">Date & Time</label><Input type="datetime-local" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="mt-1" /></div>
              <div><label className="text-sm">Location/Link</label><Input value={interviewLocation} onChange={e => setInterviewLocation(e.target.value)} className="mt-1" placeholder="Office or Zoom link" /></div>
            </div><Button onClick={scheduleInterview} size="sm">Schedule Interview</Button>
          </div>
        </div>}
      </Modal>
    </div>
  )
}

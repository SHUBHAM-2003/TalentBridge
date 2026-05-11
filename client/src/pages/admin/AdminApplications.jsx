import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { getApplications, getUserById, getJobById } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => { fetch() }, [])
  const fetch = () => setApplications(getApplications())

  const updateStatus = () => {
    const data = JSON.parse(localStorage.getItem('talentbridge_data'))
    const idx = data.applications.findIndex(a => a.id === selected.id)
    if (idx !== -1) { data.applications[idx].status = newStatus; localStorage.setItem('talentbridge_data', JSON.stringify(data)) }
    toast.success('Status updated'); fetch(); setSelected(null)
  }

  const filtered = applications.filter(app => {
    if (search && !getJobById(app.jobId)?.title.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== 'all' && app.status !== status) return false
    return true
  })

  const getBadge = (s) => {
    if (s === 'APPLIED') return { label: 'Applied', color: 'bg-blue-100 text-blue-700' }
    if (s === 'UNDER_REVIEW') return { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' }
    if (s === 'SHORTLISTED') return { label: 'Shortlisted', color: 'bg-green-100 text-green-700' }
    if (s === 'INTERVIEW_SCHEDULED') return { label: 'Interview', color: 'bg-purple-100 text-purple-700' }
    if (s === 'REJECTED') return { label: 'Rejected', color: 'bg-red-100 text-red-700' }
    if (s === 'HIRED') return { label: 'Hired', color: 'bg-emerald-100 text-emerald-700' }
    return { label: s, color: 'bg-gray-100 text-gray-700' }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Applications</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded-lg px-4 py-2"><option value="all">All Status</option><option value="APPLIED">Applied</option><option value="SHORTLISTED">Shortlisted</option><option value="HIRED">Hired</option></select>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
        <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Candidate</th><th className="text-left p-4 font-medium text-sm">Job</th><th className="text-left p-4 font-medium text-sm">Applied</th><th className="text-left p-4 font-medium text-sm">Status</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead>
        <tbody>{filtered.length === 0 ? <tr><td colSpan={5} className="p-8 text-center">No applications</td></tr>
         : filtered.map(app => {
           const badge = getBadge(app.status)
           const candidate = getUserById(app.candidateId)
           const job = getJobById(app.jobId)
           return <tr key={app.id} className="border-b hover:bg-gray-50">
             <td className="p-4 font-medium">{candidate?.fullName || 'Unknown'}</td>
             <td className="p-4 text-gray-600">{job?.title || 'Unknown'}</td>
             <td className="p-4 text-gray-500 text-sm">{new Date(app.appliedAt).toLocaleDateString()}</td>
             <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span></td>
             <td className="p-4"><Button variant="ghost" size="sm" onClick={() => { setSelected(app); setNewStatus(app.status) }}>View</Button></td>
           </tr>
         })}</tbody>
      </table></div></CardContent></Card>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Application Details">
        {selected && <div className="space-y-4">
          {(() => { const c = getUserById(selected.candidateId); const j = getJobById(selected.jobId); return <>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-sm text-gray-500">Candidate</span><p className="font-medium">{c?.fullName}</p></div>
              <div><span className="text-sm text-gray-500">Email</span><p className="font-medium">{c?.email}</p></div>
              <div><span className="text-sm text-gray-500">Job</span><p className="font-medium">{j?.title}</p></div>
              <div><span className="text-sm text-gray-500">Company</span><p className="font-medium">{j?.company?.name}</p></div>
            </div>
          </> })()}
          {selected.coverLetter && <div><span className="text-sm text-gray-500">Cover Letter</span><p className="text-gray-600 mt-1">{selected.coverLetter}</p></div>}
          <div><label className="text-sm font-medium">Update Status</label><div className="flex gap-2 mt-1"><Select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="flex-1"><option value="APPLIED">Applied</option><option value="UNDER_REVIEW">Under Review</option><option value="SHORTLISTED">Shortlisted</option><option value="INTERVIEW_SCHEDULED">Interview</option><option value="REJECTED">Rejected</option><option value="HIRED">Hired</option></Select><Button onClick={updateStatus}>Update</Button></div></div>
        </div>}
      </Modal>
    </div>
  )
}
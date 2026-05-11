import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Pause, Play, Trash2, Search } from 'lucide-react'
import { getJobs, getCompanyById, getApplications } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function AdminJobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [deleteJob, setDeleteJob] = useState(null)

  useEffect(() => { fetch() }, [])
  const fetch = () => setJobs(getJobs())

  const updateStatus = (id, newStatus) => {
    const data = JSON.parse(localStorage.getItem('talentbridge_data'))
    const idx = data.jobs.findIndex(j => j.id === id)
    if (idx !== -1) { data.jobs[idx].status = newStatus; localStorage.setItem('talentbridge_data', JSON.stringify(data)) }
    toast.success('Status updated'); fetch()
  }

  const deleteJobFn = () => {
    const data = JSON.parse(localStorage.getItem('talentbridge_data'))
    data.jobs = data.jobs.filter(j => j.id !== deleteJob.id)
    localStorage.setItem('talentbridge_data', JSON.stringify(data))
    toast.success('Deleted'); setDeleteJob(null); fetch()
  }

  const filtered = jobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== 'all' && j.status !== status) return false
    return true
  })

  const getStatusBadge = (s) => {
    if (s === 'ACTIVE') return { label: 'Active', color: 'bg-green-100 text-green-700' }
    if (s === 'PAUSED') return { label: 'Paused', color: 'bg-yellow-100 text-yellow-700' }
    return { label: s, color: 'bg-gray-100 text-gray-700' }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <Link to="/admin/jobs/new"><Button><Plus className="h-4 w-4 mr-2" />Post New Job</Button></Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="all">All Status</option><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option><option value="CLOSED">Closed</option>
        </select>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
        <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Job Title</th><th className="text-left p-4 font-medium text-sm">Company</th><th className="text-left p-4 font-medium text-sm">Type</th><th className="text-left p-4 font-medium text-sm">Status</th><th className="text-left p-4 font-medium text-sm">Applications</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead>
        <tbody>{filtered.length === 0 ? <tr><td colSpan={6} className="p-8 text-center">No jobs found</td></tr>
         : filtered.map(job => {
           const badge = getStatusBadge(job.status)
           const company = getCompanyById(job.companyId)
           const apps = getApplications().filter(a => a.jobId === job.id).length
           return <tr key={job.id} className="border-b hover:bg-gray-50">
             <td className="p-4 font-medium">{job.title}</td>
             <td className="p-4 text-gray-600">{company?.name}</td>
             <td className="p-4 text-gray-600">{job.jobType.replace('_', ' ')}</td>
             <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span></td>
             <td className="p-4">{apps}</td>
             <td className="p-4"><div className="flex gap-1">
               <button onClick={() => navigate(`/admin/jobs/${job.id}/edit`)} className="p-2 hover:bg-gray-100 rounded"><Edit className="h-4 w-4" /></button>
               {job.status === 'ACTIVE' ? <button onClick={() => updateStatus(job.id, 'PAUSED')} className="p-2 hover:bg-gray-100 rounded" title="Pause"><Pause className="h-4 w-4" /></button> : <button onClick={() => updateStatus(job.id, 'ACTIVE')} className="p-2 hover:bg-gray-100 rounded" title="Activate"><Play className="h-4 w-4" /></button>}
               <button onClick={() => setDeleteJob(job)} className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
             </div></td>
           </tr>
         })}</tbody>
      </table></div></CardContent></Card>
      <Modal isOpen={!!deleteJob} onClose={() => setDeleteJob(null)} title="Delete Job"><p className="mb-4">Delete "{deleteJob?.title}"?</p><div className="flex gap-3"><Button onClick={() => setDeleteJob(null)} variant="outline">Cancel</Button><Button onClick={deleteJobFn} variant="destructive">Delete</Button></div></Modal>
    </div>
  )
}
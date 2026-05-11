import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Pause, Play, Trash2, Search } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { formatDate } from '@/utils/helpers'
import { JOB_STATUSES } from '@/constants/options'
import toast from 'react-hot-toast'

export default function AdminJobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteJob, setDeleteJob] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status !== 'all') params.set('status', status)
      params.set('page', page)
      const { data } = await api.get(`/admin/jobs?${params}`)
      setJobs(data.data.jobs)
      setTotalPages(data.data.totalPages)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetch() }, [search, status, page])

  const updateStatus = async (id, newStatus) => {
    try { await api.patch(`/admin/jobs/${id}/status`, { status: newStatus }); toast.success('Status updated'); fetch() } catch (e) { toast.error('Failed') }
  }

  const deleteJobFn = async () => {
    try { await api.delete(`/admin/jobs/${deleteJob.id}`); toast.success('Deleted'); setDeleteJob(null); fetch() } catch (e) { toast.error('Failed') }
  }

  const getStatusBadge = (s) => JOB_STATUSES.find(bs => bs.value === s)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <Link to="/admin/jobs/new"><Button><Plus className="h-4 w-4 mr-2" />Post New Job</Button></Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="all">All Status</option>
          {JOB_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Job Title</th><th className="text-left p-4 font-medium text-sm">Company</th><th className="text-left p-4 font-medium text-sm">Type</th><th className="text-left p-4 font-medium text-sm">Status</th><th className="text-left p-4 font-medium text-sm">Applications</th><th className="text-left p-4 font-medium text-sm">Posted</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead>
              <tbody>{loading ? <tr><td colSpan={7} className="p-8 text-center">Loading...</td></tr> : jobs.length === 0 ? <tr><td colSpan={7} className="p-8 text-center">No jobs found</td></tr>
               : jobs.map(job => {
                 const badge = getStatusBadge(job.status)
                 return <tr key={job.id} className="border-b hover:bg-gray-50">
                   <td className="p-4 font-medium">{job.title}</td>
                   <td className="p-4 text-gray-600">{job.company?.name}</td>
                   <td className="p-4 text-gray-600">{job.jobType.replace('_', ' ')}</td>
                   <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>{badge?.label}</span></td>
                   <td className="p-4">{job._count?.applications || 0}</td>
                   <td className="p-4 text-gray-500 text-sm">{formatDate(job.createdAt)}</td>
                   <td className="p-4"><div className="flex gap-1">
                     <button onClick={() => navigate(`/admin/jobs/${job.id}/edit`)} className="p-2 hover:bg-gray-100 rounded"><Edit className="h-4 w-4" /></button>
                     {job.status === 'ACTIVE' ? <button onClick={() => updateStatus(job.id, 'PAUSED')} className="p-2 hover:bg-gray-100 rounded" title="Pause"><Pause className="h-4 w-4" /></button>
                      : <button onClick={() => updateStatus(job.id, 'ACTIVE')} className="p-2 hover:bg-gray-100 rounded" title="Activate"><Play className="h-4 w-4" /></button>}
                     {job.status !== 'CLOSED' && <button onClick={() => updateStatus(job.id, 'CLOSED')} className="p-2 hover:bg-gray-100 rounded text-orange-600" title="Close"><Trash2 className="h-4 w-4" /></button>}
                     <button onClick={() => setDeleteJob(job)} className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
                   </div></td>
                 </tr>
               })}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {totalPages > 1 && <div className="flex justify-center gap-2 mt-6"><Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button><span className="px-4 py-2">Page {page}</span><Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button></div>}
      <Modal isOpen={!!deleteJob} onClose={() => setDeleteJob(null)} title="Delete Job">
        <p className="mb-4">Are you sure you want to delete "{deleteJob?.title}"?</p>
        <div className="flex gap-3"><Button onClick={() => setDeleteJob(null)} variant="outline">Cancel</Button><Button onClick={deleteJobFn} variant="destructive">Delete</Button></div>
      </Modal>
    </div>
  )
}

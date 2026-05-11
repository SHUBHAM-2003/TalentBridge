import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getJobById, getCompanies, updateJob } from '@/services/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { JOB_TYPES } from '@/constants/options'
import toast from 'react-hot-toast'

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [companies] = useState(getCompanies())
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const job = getJobById(id)
    if (job) setForm(job)
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    updateJob(id, form)
    toast.success('Job updated!')
    navigate('/admin/jobs')
    setLoading(false)
  }

  if (!form.id) return <div className="max-w-3xl mx-auto px-4 py-8 text-center">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Company</label><Select value={form.companyId || ''} onChange={e => setForm({ ...form, companyId: e.target.value })} className="mt-1 w-full">{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
            <div><label className="text-sm font-medium">Title</label><Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Type</label><Select value={form.jobType || 'FULL_TIME'} onChange={e => setForm({ ...form, jobType: e.target.value })} className="mt-1 w-full">{JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              <div><label className="text-sm font-medium">Location</label><Input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1" rows={6} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Min Salary</label><Input type="number" value={form.salaryMin || ''} onChange={e => setForm({ ...form, salaryMin: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Max Salary</label><Input type="number" value={form.salaryMax || ''} onChange={e => setForm({ ...form, salaryMax: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
            </div>
          </CardContent></Card>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  )
}
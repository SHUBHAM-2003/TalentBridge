import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, X } from 'lucide-react'
import { getCompanies, createJob } from '@/services/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { JOB_TYPES } from '@/constants/options'
import toast from 'react-hot-toast'

export default function CreateJob() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [companies] = useState(getCompanies())
  const [requirements, setRequirements] = useState([])
  const [responsibilities, setResponsibilities] = useState([])
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState({ companyId: '', title: '', jobType: 'FULL_TIME', location: '', status: 'ACTIVE', description: '', salaryMin: '', salaryMax: '' })
  const [loading, setLoading] = useState(false)

  const addItem = (setter, list) => (val) => { if (val) setter([...list, val]) }
  const removeItem = (setter, list) => (idx) => setter(list.filter((_, i) => i !== idx))

  const handleSubmit = () => {
    if (!form.companyId || !form.title || !form.location || !form.description) { toast.error('Fill required fields'); return }
    setLoading(true)
    createJob({ ...form, requirements, responsibilities, skillsRequired: skills, experienceRequired: 0, salaryMin: parseInt(form.salaryMin) || 0, salaryMax: parseInt(form.salaryMax) || 0 })
    toast.success('Job created!')
    navigate('/admin/jobs')
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post New Job</h1>
      <div className="flex gap-4 mb-8">{[1, 2, 3].map(s => <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />)}</div>
      {step === 1 && <Card><CardHeader><CardTitle>Step 1: Basic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium">Company *</label><Select value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} className="mt-1 w-full"><option value="">Select Company</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
          <div><label className="text-sm font-medium">Job Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Job Type *</label><Select value={form.jobType} onChange={e => setForm({ ...form, jobType: e.target.value })} className="mt-1 w-full">{JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
            <div><label className="text-sm font-medium">Location *</label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1" /></div>
          </div>
          <div><label className="text-sm font-medium">Status</label><Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-1 w-full"><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option></Select></div>
        </CardContent></Card>}
      {step === 2 && <Card><CardHeader><CardTitle>Step 2: Job Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium">Description *</label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1" rows={6} /></div>
          <div><label className="text-sm font-medium">Requirements</label><div className="flex flex-wrap gap-2 mb-2">{requirements.map((r, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">{r}<button type="button" onClick={() => removeItem(setRequirements, requirements)(i)}><X className="h-3 w-3" /></button></span>)}</div><Input placeholder="Add requirement" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(setRequirements, requirements)(e.target.value))} /></div>
          <div><label className="text-sm font-medium">Responsibilities</label><div className="flex flex-wrap gap-2 mb-2">{responsibilities.map((r, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">{r}<button type="button" onClick={() => removeItem(setResponsibilities, responsibilities)(i)}><X className="h-3 w-3" /></button></span>)}</div><Input placeholder="Add responsibility" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(setResponsibilities, responsibilities)(e.target.value))} /></div>
          <div><label className="text-sm font-medium">Required Skills</label><div className="flex flex-wrap gap-2 mb-2">{skills.map((s, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm">{s}<button type="button" onClick={() => removeItem(setSkills, skills)(i)}><X className="h-3 w-3" /></button></span>)}</div><Input placeholder="Add skill" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(setSkills, skills)(e.target.value))} /></div>
        </CardContent></Card>}
      {step === 3 && <Card><CardHeader><CardTitle>Step 3: Salary & Review</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Min Salary</label><Input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} className="mt-1" /></div>
            <div><label className="text-sm font-medium">Max Salary</label><Input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} className="mt-1" /></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-medium mb-2">Preview</h4><p><strong>Title:</strong> {form.title || '-'}</p><p><strong>Location:</strong> {form.location || '-'}</p><p><strong>Type:</strong> {form.jobType}</p></div>
        </CardContent></Card>}
      <div className="flex justify-between mt-6">
        {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>}
        {step < 3 ? <Button type="button" onClick={() => setStep(s => s + 1)}>Next <ArrowRight className="h-4 w-4 ml-2" /></Button>
         : <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Publishing...' : 'Publish Job'}</Button>}
      </div>
    </div>
  )
}
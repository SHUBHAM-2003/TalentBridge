import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { JOB_TYPES } from '@/constants/options'
import toast from 'react-hot-toast'

const schema = z.object({
  companyId: z.string().min(1), title: z.string().min(2), description: z.string().min(10),
  jobType: z.string(), location: z.string().min(1), requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(), skillsRequired: z.array(z.string()).optional(),
  experienceRequired: z.number().optional(), salaryMin: z.number().optional(), salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(), deadline: z.string().optional(), status: z.string()
})

export default function CreateJob() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [companies, setCompanies] = useState([])
  const [requirements, setRequirements] = useState([])
  const [responsibilities, setResponsibilities] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: { jobType: 'FULL_TIME', status: 'ACTIVE', salaryCurrency: 'USD' } })

  useState(() => {
    api.get('/admin/companies').then(r => setCompanies(r.data.data.companies || [])).catch(console.error)
  }, [])

  const addItem = (setter, list) => (val) => { if (val) setter([...list, val]) }
  const removeItem = (setter, list) => (idx) => setter(list.filter((_, i) => i !== idx))

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/admin/jobs', { ...data, requirements, responsibilities, skillsRequired: skills })
      toast.success('Job created!')
      navigate('/admin/jobs')
    } catch (e) { toast.error('Failed to create job') }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post New Job</h1>
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map(s => <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />)}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && <Card><CardHeader><CardTitle>Step 1: Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Company *</label><Select {...register('companyId')} className="mt-1 w-full"><option value="">Select Company</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
            <div><label className="text-sm font-medium">Job Title *</label><Input {...register('title')} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Job Type *</label><Select {...register('jobType')} className="mt-1 w-full">{JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              <div><label className="text-sm font-medium">Location *</label><Input {...register('location')} className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium">Status</label><Select {...register('status')} className="mt-1 w-full"><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option></Select></div>
          </CardContent></Card>}
        {step === 2 && <Card><CardHeader><CardTitle>Step 2: Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Description *</label><Textarea {...register('description')} className="mt-1" rows={6} /></div>
            <div><label className="text-sm font-medium">Requirements</label>
              <div className="flex flex-wrap gap-2 mb-2">{requirements.map((r, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">{r}<button type="button" onClick={() => removeItem(setRequirements, requirements)(i)}><X className="h-3 w-3" /></button></span>)}</div>
              <Input placeholder="Add requirement" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(setRequirements, requirements)(e.target.value))} /></div>
            <div><label className="text-sm font-medium">Responsibilities</label>
              <div className="flex flex-wrap gap-2 mb-2">{responsibilities.map((r, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">{r}<button type="button" onClick={() => removeItem(setResponsibilities, responsibilities)(i)}><X className="h-3 w-3" /></button></span>)}</div>
              <Input placeholder="Add responsibility" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(setResponsibilities, responsibilities)(e.target.value))} /></div>
            <div><label className="text-sm font-medium">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">{skills.map((s, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm">{s}<button type="button" onClick={() => removeItem(setSkills, skills)(i)}><X className="h-3 w-3" /></button></span>)}</div>
              <Input placeholder="Add skill" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(setSkills, skills)(e.target.value))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Experience Required (years)</label><Input type="number" {...register('experienceRequired')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Application Deadline</label><Input type="date" {...register('deadline')} className="mt-1" /></div>
            </div>
          </CardContent></Card>}
        {step === 3 && <Card><CardHeader><CardTitle>Step 3: Salary & Review</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm font-medium">Min Salary</label><Input type="number" {...register('salaryMin')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Max Salary</label><Input type="number" {...register('salaryMax')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Currency</label><Input {...register('salaryCurrency')} className="mt-1" /></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-medium mb-2">Preview</h4><p><strong>Title:</strong> {watch('title')}</p><p><strong>Location:</strong> {watch('location')}</p><p><strong>Type:</strong> {watch('jobType')}</p></div>
          </CardContent></Card>}
        <div className="flex justify-between mt-6">
          {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>}
          {step < 3 ? <Button type="button" onClick={() => setStep(s => s + 1)}>Next <ArrowRight className="h-4 w-4 ml-2" /></Button>
           : <Button type="submit" disabled={loading}>{loading ? 'Publishing...' : 'Publish Job'}</Button>}
        </div>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import api from '@/services/api'
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
  const [job, setJob] = useState(null)
  const [companies, setCompanies] = useState([])
  const [requirements, setRequirements] = useState([])
  const [responsibilities, setResponsibilities] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    Promise.all([
      api.get(`/jobs/${id}`).catch(() => null),
      api.get('/admin/companies')
    ]).then(([jobRes, compRes]) => {
      if (jobRes?.data?.data?.job) {
        const j = jobRes.data.data.job
        setJob(j)
        setRequirements(j.requirements || [])
        setResponsibilities(j.responsibilities || [])
        setSkills(j.skillsRequired || [])
        reset(j)
      }
      setCompanies(compRes.data.data.companies || [])
    })
  }, [id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put(`/admin/jobs/${id}`, { ...data, requirements, responsibilities, skillsRequired: skills })
      toast.success('Job updated!')
      navigate('/admin/jobs')
    } catch (e) { toast.error('Failed to update') }
    setLoading(false)
  }

  if (!job) return <div className="max-w-3xl mx-auto px-4 py-8 text-center">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card><CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Company</label><Select {...register('companyId')} className="mt-1 w-full">{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
            <div><label className="text-sm font-medium">Title</label><Input {...register('title')} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Type</label><Select {...register('jobType')} className="mt-1 w-full">{JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              <div><label className="text-sm font-medium">Location</label><Input {...register('location')} className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium">Description</label><Textarea {...register('description')} className="mt-1" rows={6} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm font-medium">Min Salary</label><Input type="number" {...register('salaryMin')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Max Salary</label><Input type="number" {...register('salaryMax')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Experience</label><Input type="number" {...register('experienceRequired')} className="mt-1" /></div>
            </div>
          </CardContent></Card>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, DollarSign, Calendar, Share2, Bookmark, ArrowLeft, ExternalLink } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { formatSalary, formatDate, isNew, isUrgent } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [job, setJob] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [showApply, setShowApply] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`)
        setJob(data.data.job)
        const rel = await api.get(`/jobs/${id}/related`)
        setRelated(rel.data.data.jobs || [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetch()
  }, [id])

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setApplying(true)
    try {
      await api.post('/applications', { jobId: id, coverLetter })
      toast.success('Application submitted!')
      setShowApply(false)
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to apply') }
    setApplying(false)
  }

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      await api.post(`/saved-jobs/${id}`)
      toast.success('Job saved!')
    } catch (e) { toast.error('Failed to save job') }
  }

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 w-1/3 bg-gray-200 rounded"></div><div className="h-4 w-1/2 bg-gray-200 rounded"></div></div></div>
  if (!job) return <div className="max-w-7xl mx-auto px-4 py-8 text-center"><h2 className="text-2xl font-bold">Job not found</h2><Link to="/jobs"><Button className="mt-4">Browse Jobs</Button></Link></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft className="h-4 w-4" /> Back</button>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-500">{job.company?.name?.slice(0, 2).toUpperCase()}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{job.title}</h1>
                      <Link to={`/companies/${job.companyId}`} className="text-primary hover:underline">{job.company?.name}</Link>
                    </div>
                    <div className="flex gap-2">
                      {isNew(job.createdAt) && <Badge className="bg-green-100 text-green-700">New</Badge>}
                      {isUrgent(job.deadline) && <Badge className="bg-red-100 text-red-700">Urgent</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.jobType.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    {job.deadline && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Due: {formatDate(job.deadline)}</span>}
                  </div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-line">{job.description}</div>
              </div>
              {job.requirements?.length > 0 && <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>}
              {job.responsibilities?.length > 0 && <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>}
              {job.skillsRequired?.length > 0 && <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">{job.skillsRequired.map(s => <Badge key={s} className="bg-gray-100">{s}</Badge>)}</div>
              </div>}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Apply for this position</h3>
              <div className="space-y-3">
                <Button onClick={() => isAuthenticated ? setShowApply(true) : navigate('/login')} className="w-full">Apply Now</Button>
                <Button variant="outline" onClick={handleSave} className="w-full"><Bookmark className="h-4 w-4 mr-2" />Save Job</Button>
                <Button variant="ghost" onClick={copyLink} className="w-full"><Share2 className="h-4 w-4 mr-2" />Share</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Link to={`/companies/${job.companyId}`} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">{job.company?.name?.slice(0, 2).toUpperCase()}</div>
                <div><h4 className="font-semibold">{job.company?.name}</h4><p className="text-sm text-gray-500">{job.company?.industry}</p></div>
              </Link>
              {job.company?.website && <a href={job.company.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-sm text-primary mt-3 hover:underline"><ExternalLink className="h-4 w-4" />Visit Website</a>}
            </CardContent>
          </Card>
        </div>
      </div>
      {related.length > 0 && <div className="mt-12"><h2 className="text-xl font-bold mb-6">Related Jobs</h2><div className="grid md:grid-cols-3 gap-6">{related.map(j => (<Link key={j.id} to={`/jobs/${j.id}`}><Card className="hover:shadow-lg"><CardContent className="p-4"><h3 className="font-semibold line-clamp-1">{j.title}</h3><p className="text-sm text-gray-500">{j.company?.name}</p><p className="text-sm text-gray-400 mt-2">{j.location}</p></CardContent></Card></Link>))}</div></div>}
      <Modal isOpen={showApply} onClose={() => setShowApply(false)} title="Apply to this job">
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Cover Letter (optional)</label><textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit..." className="mt-1 w-full border rounded-lg p-3 text-sm" rows={5}></textarea></div>
          <Button onClick={handleApply} disabled={applying} className="w-full">{applying ? 'Submitting...' : 'Submit Application'}</Button>
        </div>
      </Modal>
    </div>
  )
}
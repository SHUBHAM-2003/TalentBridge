import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, DollarSign, Calendar, Share2, Bookmark, ArrowLeft, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { formatSalary, isNew } from '@/utils/helpers'
import { getJobWithCompany, getAllJobs } from '@/services/mockData'
import toast from 'react-hot-toast'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showApply, setShowApply] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applied, setApplied] = useState(false)

  const job = getJobWithCompany(id)

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Job not found</h2>
        <Link to="/jobs"><Button className="mt-4">Browse Jobs</Button></Link>
      </div>
    )
  }

  const handleApply = () => {
    setApplied(true)
    toast.success('Application submitted! (Demo)')
    setShowApply(false)
  }

  const related = getAllJobs().filter(j => j.companyId === job.companyId && j.id !== job.id).slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-500">
                  {job.company?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{job.title}</h1>
                      <Link to={`/companies/${job.companyId}`} className="text-primary hover:underline">{job.company?.name}</Link>
                    </div>
                    {isNew(job.createdAt) && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">New</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.jobType.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-line">{job.description}</div>
              </div>
              {job.requirements?.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}
              {job.responsibilities?.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Apply for this position</h3>
              {applied ? (
                <div className="text-center text-green-600 py-4">Applied! (Demo)</div>
              ) : (
                <Button onClick={() => setShowApply(true)} className="w-full">Apply Now</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Related Jobs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map(j => (
              <Link key={j.id} to={`/jobs/${j.id}`}>
                <Card className="hover:shadow-lg"><CardContent className="p-4"><h3 className="font-semibold line-clamp-1">{j.title}</h3><p className="text-sm text-gray-500">{j.location}</p></CardContent></Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Modal isOpen={showApply} onClose={() => setShowApply(false)} title="Apply to this job">
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Cover Letter (optional)</label><textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="mt-1 w-full border rounded-lg p-3 text-sm" rows={5} placeholder="Tell us why you're a great fit..."></textarea></div>
          <Button onClick={handleApply} className="w-full">Submit Application</Button>
        </div>
      </Modal>
    </div>
  )
}
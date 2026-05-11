import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, MapPin } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatSalary, formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function SavedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])
  const fetch = async () => {
    try { const { data } = await api.get('/saved-jobs'); setJobs(data.data.jobs || []) } catch (e) { console.error(e) }
    setLoading(false)
  }

  const unsave = async (jobId) => {
    try { await api.delete(`/saved-jobs/${jobId}`); toast.success('Removed from saved'); setJobs(jobs.filter(j => j.id !== jobId)) } catch (e) { toast.error('Failed') }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
      {loading ? <div className="text-center py-12">Loading...</div> : jobs.length === 0 ? <div className="text-center py-16"><h3 className="text-xl font-semibold mb-4">No saved jobs</h3><Link to="/jobs"><Button>Browse Jobs</Button></Link></div>
       : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{jobs.map(job => (
         <Card key={job.id}><CardContent className="p-6">
           <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
           <p className="text-gray-500 text-sm">{job.company?.name}</p>
           <div className="flex items-center gap-1 text-sm text-gray-400 mt-2"><MapPin className="h-4 w-4" />{job.location}</div>
           <div className="text-primary font-semibold mt-2">{formatSalary(job.salaryMin, job.salaryMax)}</div>
           <div className="flex items-center justify-between mt-4">
             <Link to={`/jobs/${job.id}`}><Button variant="ghost" size="sm">View Details</Button></Link>
             <Button variant="ghost" size="sm" onClick={() => unsave(job.id)}><Trash2 className="h-4 w-4" /></Button>
           </div>
         </CardContent></Card>
       ))}</div>}
    </div>
  )
}

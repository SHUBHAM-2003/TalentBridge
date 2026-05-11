import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Globe, MapPin, ExternalLink } from 'lucide-react'
import { getCompanyById, getJobsByCompany } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'

export default function CompanyDetail() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const comp = getCompanyById(id)
    setCompany(comp)
    if (comp) setJobs(getJobsByCompany(id).filter(j => j.status === 'ACTIVE'))
    setLoading(false)
  }, [id])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse h-32 bg-gray-200 rounded"></div></div>
  if (!company) return <div className="max-w-7xl mx-auto px-4 py-8 text-center"><h2 className="text-2xl font-bold">Company not found</h2></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500">{company.name?.slice(0, 2).toUpperCase()}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
            <p className="text-gray-500 mb-2">{company.industry}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {company.city && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{company.city}, {company.state}</span>}
              {company.website && <a href={company.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-primary hover:underline"><Globe className="h-4 w-4" />{company.website}</a>}
            </div>
          </div>
        </div>
        {company.description && <div className="mt-6 text-gray-600">{company.description}</div>}
      </div>
      <h2 className="text-xl font-bold mb-6">Open Positions ({jobs.length})</h2>
      {jobs.length === 0 ? <div className="text-center py-12 text-gray-500">No open positions</div>
       : <div className="grid md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`}><Card className="hover:shadow-lg"><CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{job.jobType.replace('_', ' ')}</span>
              </div>
            </CardContent></Card></Link>
          ))}
        </div>}
    </div>
  )
}
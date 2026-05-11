import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { getActiveJobs } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { formatSalary, isNew } from '@/utils/helpers'
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants/options'

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    jobType: '',
    experience: ''
  })

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setJobs(getActiveJobs())
      setLoading(false)
    }, 300)
  }, [])

  const filtered = jobs.filter(job => {
    if (filters.keyword && !job.title.toLowerCase().includes(filters.keyword.toLowerCase())) return false
    if (filters.city && !job.location.toLowerCase().includes(filters.city.toLowerCase())) return false
    if (filters.jobType && job.jobType !== filters.jobType) return false
    return true
  })

  const take = 12
  const totalPages = Math.ceil(filtered.length / take)
  const paginated = filtered.slice((page - 1) * take, page * take)

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ keyword: '', city: '', jobType: '', experience: '' })
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl border p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-primary">Clear all</button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={filters.keyword} onChange={e => updateFilter('keyword', e.target.value)} placeholder="Keywords" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={filters.city} onChange={e => updateFilter('city', e.target.value)} placeholder="City" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Job Type</label>
                <div className="space-y-2">
                  {JOB_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={filters.jobType === value} onChange={() => updateFilter('jobType', value === filters.jobType ? '' : value)} className="rounded text-primary" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold">Job Listings</h1>
              <p className="text-gray-500">{filtered.length} jobs found</p>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {paginated.map(job => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                          {job.company?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-secondary">{job.title}</h3>
                              <p className="text-sm text-gray-500">{job.company?.name}</p>
                            </div>
                            {isNew(job.createdAt) && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">New</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{job.jobType.replace('_', ' ')}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      </div>
                      <div className="text-lg font-bold text-primary">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="px-4">Page {page} of {totalPages}</span>
              <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
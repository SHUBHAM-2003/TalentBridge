import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { formatSalary, formatDate, isNew, isUrgent } from '@/utils/helpers'
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants/options'

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    jobType: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
    sort: searchParams.get('sort') || 'latest'
  })

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.keyword) params.set('keyword', filters.keyword)
        if (filters.city) params.set('city', filters.city)
        if (filters.jobType) params.set('jobType', filters.jobType)
        if (filters.experience) params.set('experience', filters.experience)
        if (filters.sort) params.set('sort', filters.sort)
        params.set('page', page)
        const { data } = await api.get(`/jobs?${params}`)
        setJobs(data.data.jobs)
        setTotal(data.data.total)
        setTotalPages(data.data.totalPages)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchJobs()
  }, [filters, page])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ keyword: '', city: '', jobType: '', experience: '', sort: 'latest' })
    setPage(1)
  }

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'sort')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl border p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              {activeFilters.length > 0 && <button onClick={clearFilters} className="text-sm text-primary">Clear all</button>}
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
              <div>
                <label className="text-sm font-medium mb-2 block">Experience</label>
                <div className="space-y-2">
                  {EXPERIENCE_LEVELS.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={filters.experience === value} onChange={() => updateFilter('experience', value === filters.experience ? '' : value)} className="rounded text-primary" />
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
              <p className="text-gray-500">{total} jobs found</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                <option value="latest">Latest</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map(([key, value]) => (
                <button key={key} onClick={() => updateFilter(key, '')} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {key}: {value} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {jobs.map(job => (
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
                            <div className="flex gap-1">
                              {isNew(job.createdAt) && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">New</span>}
                              {isUrgent(job.deadline) && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Urgent</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{job.jobType.replace('_', ' ')}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-primary">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                          <div className="text-xs text-gray-400">Posted {formatDate(job.createdAt)}</div>
                        </div>
                      </div>
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

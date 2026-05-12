import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, X, ChevronLeft, ChevronRight, SlidersHorizontal, MessageCircle, Send } from 'lucide-react'
import { getActiveJobs } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { formatSalary, isNew } from '@/utils/helpers'
import { JOB_TYPES } from '@/constants/options'
import toast from 'react-hot-toast'

function NeetaBubble({ onOpen }) {
  return (
    <button onClick={onOpen} className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-primary rounded-full shadow-xl flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110">
      <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
      <MessageCircle className="h-7 w-7 text-white" />
    </button>
  )
}

function NeetaPanel({ onClose }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ text: "Here are the jobs I found for you! Want to refine your search? Tell me more.", from: 'neeta' }])
  const [typing, setTyping] = useState(false)
  const inputRef = useRef(null)

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input
    setMessages(m => [...m, { text: userMsg, from: 'user' }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { text: "I'm refining your search now! Give me a moment... 😊", from: 'neeta' }])
      setTimeout(() => {
        toast.success("Updating job results with your preferences...")
        onClose()
      }, 1500)
    }, 1200)
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"><span className="text-xl">🤖</span></div>
        <div><h4 className="font-semibold text-white">NEETA</h4><p className="text-blue-100 text-xs">AI Job Assistant</p></div>
        <button onClick={onClose} className="ml-auto text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.from === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>{m.text}</div>
          </div>
        ))}
        {typing && <div className="flex items-center gap-1"><div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" /><div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /><div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} /></div>}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Tell me more about what you want..." className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        <button onClick={handleSend} className="h-10 w-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-600"><Send className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showNeeta, setShowNeeta] = useState(false)
  const [neetaCount, setNeetaCount] = useState(0)
  const [neetaQuery, setNeetaQuery] = useState('')
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    jobType: '',
    experience: ''
  })

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const all = getActiveJobs()
      setAllJobs(all)
      
      const matched = searchParams.get('matched')
      const query = searchParams.get('query')
      const isNeeta = searchParams.get('neeta') === 'true'
      
      if (isNeeta && matched) {
        const matchedIds = matched.split(',').filter(Boolean)
        const filtered = all.filter(j => matchedIds.includes(j.id))
        setJobs(filtered)
        setNeetaCount(filtered.length)
        setNeetaQuery(query || '')
      } else {
        setJobs(all)
      }
      setLoading(false)
    }, 300)
  }, [searchParams])

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

  const dismissNeeta = () => {
    setNeetaCount(0)
    setJobs(allJobs)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {neetaCount > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-blue-50 border border-primary/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h4 className="font-semibold">NEETA found {neetaCount} jobs matching your profile</h4>
              {neetaQuery && <p className="text-sm text-gray-500">Searching for: "{neetaQuery}"</p>}
            </div>
          </div>
          <button onClick={dismissNeeta} className="text-sm text-primary hover:underline">Show all jobs</button>
        </div>
      )}

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
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-l-4 border-l-primary">
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

      <NeetaBubble onOpen={() => setShowNeeta(true)} />
      {showNeeta && <NeetaPanel onClose={() => setShowNeeta(false)} />}
    </div>
  )
}
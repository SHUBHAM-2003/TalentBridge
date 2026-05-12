import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, Users, CheckCircle, ArrowRight, Building2, Zap, Shield, Star, TrendingUp, Download, X, MessageCircle, Send, ChevronUp, Calculator, UserCheck, Award, Clock, Phone, BookOpen, Heart } from 'lucide-react'
import { getStats, getFeaturedJobs, getCompanies, getActiveJobs } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatSalary } from '@/utils/helpers'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { label: 'Accountant', icon: Calculator }, { label: 'Sales Executive', icon: TrendingUp }, { label: 'Store Manager', icon: Building2 },
  { label: 'Data Entry', icon: TrendingUp }, { label: 'Driver', icon: TrendingUp }, { label: 'Delivery Boy', icon: TrendingUp },
  { label: 'Receptionist', icon: Users }, { label: 'Security Guard', icon: Shield }, { label: 'Marketing', icon: TrendingUp },
  { label: 'Customer Support', icon: UserCheck }, { label: 'Teacher', icon: BookOpen }, { label: 'Electrician', icon: Zap },
  { label: 'Warehouse Staff', icon: Briefcase }, { label: 'IT Support', icon: TrendingUp }
]

const TRENDING_SKILLS = ['Tally', 'MS Excel', 'GST Filing', 'Customer Handling', 'Cash Management', 'Inventory', 'Cold Calling', 'Data Entry', 'Spoken English', 'Delivery Operations']

const TESTIMONIALS = [
  { name: 'Priya Sharma', job: 'Accounts Executive', company: 'Ramesh Traders', quote: 'I got hired within 2 weeks of registering. NEETA helped me find exactly what I was looking for.', initials: 'PS' },
  { name: 'Rajesh Kumar', job: 'Delivery Executive', company: 'FastTrack Logistics', quote: 'Simple process, no complicated forms. Applied once and got a call the next day!', initials: 'RK' },
  { name: 'Anita Desai', job: 'Customer Service Representative', company: 'Smart Finance', quote: 'The team helped me prepare for my interview. Now I have a stable job I love.', initials: 'AD' }
]

const BLOG_POSTS = [
  { title: 'How to Write a Resume With No Experience', desc: 'Simple tips to impress a recruiter even as a fresher.', color: 'bg-blue-500' },
  { title: '5 Things to Do Before Your First Interview', desc: 'Be ready, be confident. Here\'s your checklist.', color: 'bg-green-500' },
  { title: 'What to Wear for a Job Interview in 2025', desc: 'First impressions matter. Dress right for the role.', color: 'bg-purple-500' }
]

const TRUST_FEATURES = [
  { icon: CheckCircle, title: 'Free to Use', desc: 'No charges ever. Register and apply for free.' },
  { icon: Building2, title: 'Real Local Jobs', desc: 'Every job posted is from a verified local company.' },
  { icon: Clock, title: 'Fast Updates', desc: 'Know your application status within 48 hours.' },
  { icon: Phone, title: 'Personal Support', desc: 'Our team guides you through the entire hiring process.' }
]

function AnimatedNumber({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const start = Date.now()
        const step = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          setCount(Math.floor(progress * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  if (!visible) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-24 right-6 z-40 h-10 w-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-all hover:-translate-y-1">
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}

function FloatingBadges() {
  const badges = ['500+ Jobs', 'Free to Apply', 'Verified Companies', 'Fast Hiring']
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {badges.map((b, i) => (
        <div key={b} className="absolute animate-pulse" style={{ top: `${10 + i * 25}%`, [i % 2 === 0 ? 'left' : 'right']: '-20px', animationDelay: `${i * 0.5}s` }}>
          <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/30">{b}</span>
        </div>
      ))}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 })
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [latestJobs, setLatestJobs] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [showNeeta, setShowNeeta] = useState(false)
  const [neetaInput, setNeetaInput] = useState('')
  const [neetaDismissed, setNeetaDismissed] = useState(localStorage.getItem('tb_neeta_dismissed') === 'true')

  useEffect(() => {
    setStats(getStats())
    setFeaturedJobs(getFeaturedJobs())
    setCompanies(getCompanies())
    setLatestJobs(getActiveJobs().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8))
  }, [])

  useEffect(() => {
    if (!neetaDismissed) {
      const timer = setTimeout(() => setShowNeeta(true), 8000)
      return () => clearTimeout(timer)
    }
  }, [neetaDismissed])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?keyword=${searchKeyword}&city=${searchCity}`)
  }

  const handleCategoryClick = (cat) => {
    navigate(`/jobs?keyword=${cat}`)
  }

  const handleSkillClick = (skill) => {
    navigate(`/jobs?keyword=${skill}`)
  }

  const handleNeetaSearch = () => {
    if (!neetaInput.trim()) return
    const allJobs = getActiveJobs()
    const keywords = neetaInput.toLowerCase().split(/\s+/).filter(w => w.length > 2)
    const scored = allJobs.map(job => {
      let score = 0
      const text = `${job.title} ${job.description} ${job.location} ${job.skillsRequired?.join(' ')} ${job.jobType}`.toLowerCase()
      keywords.forEach(k => { if (text.includes(k)) score++ })
      return { job, score }
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score)
    const matchedIds = scored.map(s => s.job.id).join(',')
    setShowNeeta(false)
    localStorage.setItem('tb_neeta_dismissed', 'true')
    setNeetaDismissed(true)
    navigate(`/jobs?neeta=true&matched=${matchedIds}&query=${encodeURIComponent(neetaInput)}`)
  }

  const handleBlogClick = (post) => {
    toast.success(`${post.title} - Coming soon!`)
  }

  return (
    <div className="scroll-smooth">
      <BackToTop />

      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-secondary py-32 text-white overflow-hidden">
        <FloatingBadges />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Find Your Next Opportunity</h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Connect with top companies and discover thousands of job opportunities tailored to your skills and career goals.</p>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2 shadow-xl">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="h-5 w-5 text-gray-400" />
              <input value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} placeholder="Job title, keywords, or company" className="flex-1 py-3 text-gray-900 outline-none placeholder:text-gray-400" />
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 border-t md:border-t-0 md:border-l border-gray-200">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input value={searchCity} onChange={e => setSearchCity(e.target.value)} placeholder="City or location" className="flex-1 py-3 text-gray-900 outline-none placeholder:text-gray-400" />
            </div>
            <Button type="submit" className="bg-accent hover:bg-amber-600 text-secondary px-8">Search</Button>
          </form>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ icon: Briefcase, label: 'Active Jobs', value: stats.jobs }, { icon: Building2, label: 'Companies', value: stats.companies }, { icon: Users, label: 'Candidates', value: stats.candidates }, { icon: CheckCircle, label: 'Placed', value: Math.floor(stats.candidates * 0.7) }].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-secondary"><AnimatedNumber target={value} /></div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-center">Browse by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => handleCategoryClick(label)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full whitespace-nowrap hover:bg-primary hover:text-white hover:border-primary transition-all hover:-translate-y-1 shadow-sm">
                <Icon className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold">Featured Jobs</h2>
            <Link to="/jobs"><Button variant="ghost" className="text-primary">View All <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                        {job.company?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary line-clamp-2">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company?.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{job.jobType.replace('_', ' ')}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{job.location}</span>
                    </div>
                    <div className="text-lg font-semibold text-primary">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{ icon: Users, title: 'Create Your Free Account', desc: 'Sign up in 2 minutes. No fees, no paperwork.' }, { icon: Search, title: 'Browse & Apply', desc: 'Find jobs that match your skills and apply with one click.' }, { icon: Phone, title: 'Get the Call', desc: 'Our team connects you with the company directly.' }].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="text-center relative">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold">Featured Companies Hiring Now</h2>
            <Link to="/companies"><Button variant="ghost" className="text-primary">View All <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 6).map(company => {
              const jobCount = getActiveJobs().filter(j => j.companyId === company.id).length
              return (
                <Link key={company.id} to={`/companies/${company.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                          {company.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary">{company.name}</h3>
                          <p className="text-sm text-gray-500">{company.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{company.city}</span>
                        {jobCount > 0 && <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded">{jobCount} Open</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold">Latest Jobs Near You</h2>
            <Link to="/jobs"><Button variant="ghost" className="text-primary">View All Jobs <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestJobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-secondary line-clamp-1 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{job.company?.name}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{job.jobType.replace('_', ' ')}</span>
                    </div>
                    <div className="text-primary font-semibold text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-12">Why Job Seekers Trust TalentBridge</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-white rounded-xl border shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-12">Numbers That Speak</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ value: 500, suffix: '+', label: 'Jobs Posted' }, { value: 120, suffix: '+', label: 'Companies Registered' }, { value: 1200, suffix: '+', label: 'Candidates Placed' }, { value: 48, suffix: 'hrs', label: 'Average Response Time' }].map(({ value, suffix, label }) => (
              <div key={label}>
                <div className="text-4xl md:text-5xl font-bold mb-2"><AnimatedNumber target={value} />{suffix}</div>
                <div className="text-blue-200 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-center">Currently Trending Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TRENDING_SKILLS.map(skill => (
              <button key={skill} onClick={() => handleSkillClick(skill)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full hover:bg-primary hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                <TrendingUp className="h-4 w-4 text-accent" /><span className="text-sm font-medium">{skill}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">{t.initials}</div>
                    <div>
                      <h4 className="font-semibold">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.job} at {t.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-gray-600 italic">"{t.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-12">Blog & Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map(post => (
              <Card key={post.title} className="overflow-hidden cursor-pointer hover:shadow-xl transition-all" onClick={() => handleBlogClick(post)}>
                <div className={`h-3 ${post.color}`} />
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Apply to Jobs From Your Phone</h2>
              <p className="text-blue-100">Download the TalentBridge app — coming soon</p>
            </div>
            <div className="flex gap-4">
              <div className="group relative">
                <button className="flex items-center gap-2 px-5 py-3 bg-white/20 rounded-lg opacity-60 cursor-not-allowed">
                  <Download className="h-5 w-5" /><span className="text-sm font-medium">App Store</span>
                </button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
              </div>
              <div className="group relative">
                <button className="flex items-center gap-2 px-5 py-3 bg-white/20 rounded-lg opacity-60 cursor-not-allowed">
                  <Download className="h-5 w-5" /><span className="text-sm font-medium">Google Play</span>
                </button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Create your free account today and start connecting with your dream career.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"><Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">Create Free Account</Button></Link>
            <Link to="/jobs"><Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">Browse All Jobs</Button></Link>
          </div>
        </div>
      </section>

      {showNeeta && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h4 className="font-semibold text-white">NEETA</h4>
              <p className="text-blue-100 text-xs">AI Job Assistant</p>
            </div>
            <button onClick={() => { setShowNeeta(false); localStorage.setItem('tb_neeta_dismissed', 'true'); setNeetaDismissed(true) }} className="ml-auto text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-sm">🤖</span></div>
              <p className="text-sm text-gray-700 bg-gray-100 rounded-lg rounded-tl-none p-3">Hi! I'm NEETA 👋 Tell me about yourself and I'll find the best jobs for you on TalentBridge.</p>
            </div>
            <textarea value={neetaInput} onChange={e => setNeetaInput(e.target.value)} placeholder="E.g. I am a fresher, completed B.Com, looking for accounting jobs in Mumbai, salary around 15,000." className="w-full border rounded-lg p-3 text-sm resize-none" rows={3} />
            <Button onClick={handleNeetaSearch} className="w-full bg-primary hover:bg-primary-600">Find My Jobs</Button>
          </div>
        </div>
      )}
    </div>
  )
}
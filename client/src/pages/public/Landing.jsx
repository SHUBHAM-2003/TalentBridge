import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, Users, CheckCircle, ArrowRight, Building2, Zap, Shield } from 'lucide-react'
import api from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatSalary } from '@/utils/helpers'

export default function Landing() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 })
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchCity, setSearchCity] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, jobsFeaturedRes] = await Promise.all([
          api.get('/jobs?status=ACTIVE'),
          api.get('/jobs/featured')
        ])
        setStats({ jobs: jobsRes.data.data.total, companies: 8, candidates: 10 })
        setFeaturedJobs(jobsFeaturedRes.data.data.jobs || [])
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?keyword=${searchKeyword}&city=${searchCity}`)
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-secondary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
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
              <div className="text-3xl font-bold text-secondary">{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
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
                <Card className="hover:shadow-lg transition-shadow h-full">
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
            {[{ icon: Search, title: 'Browse', desc: 'Search through thousands of job listings from top companies' }, { icon: Zap, title: 'Apply', desc: 'Submit your application with a personalized cover letter' }, { icon: Shield, title: 'Get Hired', desc: 'Interview with employers and land your dream job' }].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-gray-300 mb-2">0{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
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
    </div>
  )
}

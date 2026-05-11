import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { INDUSTRIES } from '@/constants/options'
import { getCompanies } from '@/services/mockData'

export default function Companies() {
  const [companies, setCompanies] = useState(getCompanies())
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')

  const filtered = companies.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (industry && c.industry !== industry) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-heading font-bold mb-4">Our Partner Companies</h1>
        <p className="text-gray-500">Discover leading companies hiring on TalentBridge</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="w-full pl-10 pr-4 py-3 border rounded-lg" /></div>
        <select value={industry} onChange={e => setIndustry(e.target.value)} className="border rounded-lg px-4 py-3">
          <option value="">All Industries</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? <div className="text-center py-16"><h3 className="text-xl font-semibold">No companies found</h3></div>
       : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <Link key={c.id} to={`/companies/${c.id}`}><Card className="hover:shadow-lg transition-shadow"><CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-lg text-gray-500">{c.name?.slice(0, 2).toUpperCase()}</div>
                <div><h3 className="font-semibold">{c.name}</h3><p className="text-sm text-gray-500">{c.industry}</p></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {c.city && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{c.city}</span>}
              </div>
            </CardContent></Card></Link>
          ))}
        </div>}
    </div>
  )
}
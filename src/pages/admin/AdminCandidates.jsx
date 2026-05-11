import { useEffect, useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { getUsers } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { setCandidates(getUsers().filter(u => u.role === 'CANDIDATE')) }, [])

  const filtered = candidates.filter(c => !search || c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Candidates</h1>
      <div className="relative mb-6 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
        <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Name</th><th className="text-left p-4 font-medium text-sm">Email</th><th className="text-left p-4 font-medium text-sm">City</th><th className="text-left p-4 font-medium text-sm">Skills</th><th className="text-left p-4 font-medium text-sm">Experience</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead>
        <tbody>{filtered.length === 0 ? <tr><td colSpan={6} className="p-8 text-center">No candidates</td></tr>
         : filtered.map(c => <tr key={c.id} className="border-b hover:bg-gray-50">
           <td className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">{c.fullName?.slice(0, 2).toUpperCase()}</div><span className="font-medium">{c.fullName}</span></div></td>
           <td className="p-4 text-gray-600">{c.email}</td>
           <td className="p-4 text-gray-600">{c.city || '-'}</td>
           <td className="p-4"><div className="flex gap-1 flex-wrap">{c.skills?.slice(0, 3).map(s => <span key={s} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{s}</span>)}</div></td>
           <td className="p-4 text-gray-600">{c.experienceYears || 0} yrs</td>
           <td className="p-4"><Button variant="ghost" size="sm" onClick={() => setSelected(c)}><Eye className="h-4 w-4" /></Button></td>
         </tr>)}</tbody>
      </table></div></CardContent></Card>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Candidate Profile">
        {selected && <div className="space-y-4">
          <div className="flex items-center gap-4"><div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold">{selected.fullName?.slice(0, 2).toUpperCase()}</div><div><h3 className="font-bold text-lg">{selected.fullName}</h3><p className="text-gray-500">{selected.email}</p></div></div>
          <div><strong>Phone:</strong> {selected.phone || '-'}</div>
          <div><strong>Location:</strong> {selected.city || '-'}, {selected.state || '-'}</div>
          <div><strong>Experience:</strong> {selected.experienceYears || 0} years</div>
          {selected.skills?.length > 0 && <div><strong>Skills:</strong><div className="flex gap-2 flex-wrap mt-1">{selected.skills.map(s => <span key={s} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">{s}</span>)}</div></div>}
          {selected.bio && <div><strong>Bio:</strong> <p className="text-gray-600 mt-1">{selected.bio}</p></div>}
          {selected.education && <div><strong>Education:</strong> {selected.education}</div>}
        </div>}
      </Modal>
    </div>
  )
}
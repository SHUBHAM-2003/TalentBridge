import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/services/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { INDUSTRIES } from '@/constants/options'
import toast from 'react-hot-toast'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editCompany, setEditCompany] = useState(null)
  const [form, setForm] = useState({ name: '', industry: '', website: '', description: '', city: '', state: '' })

  useEffect(() => { fetch() }, [])
  const fetch = () => setCompanies(getCompanies())

  const openCreate = () => { setEditCompany(null); setForm({ name: '', industry: '', website: '', description: '', city: '', state: '' }); setShowModal(true) }
  const openEdit = (c) => { setEditCompany(c); setForm(c); setShowModal(true) }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editCompany) { updateCompany(editCompany.id, form); toast.success('Updated') }
    else { createCompany(form); toast.success('Created') }
    setShowModal(false); fetch()
  }
  const handleDelete = (id) => { if (confirm('Delete this company?')) { deleteCompany(id); toast.success('Deleted'); fetch() } }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">Manage Companies</h1><Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Company</Button></div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
        <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium text-sm">Logo</th><th className="text-left p-4 font-medium text-sm">Name</th><th className="text-left p-4 font-medium text-sm">Industry</th><th className="text-left p-4 font-medium text-sm">City</th><th className="text-left p-4 font-medium text-sm">Actions</th></tr></thead>
        <tbody>{companies.map(c => <tr key={c.id} className="border-b hover:bg-gray-50">
          <td className="p-4"><div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500">{c.name?.slice(0, 2).toUpperCase()}</div></td>
          <td className="p-4 font-medium">{c.name}</td>
          <td className="p-4 text-gray-600">{c.industry}</td>
          <td className="p-4 text-gray-600">{c.city}</td>
          <td className="p-4"><div className="flex gap-1"><button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 rounded"><Edit className="h-4 w-4" /></button><button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-4 w-4" /></button></div></td>
        </tr>)}</tbody>
      </table></div></CardContent></Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCompany ? 'Edit Company' : 'Add Company'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Name *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1" required /></div>
          <div><label className="text-sm font-medium">Industry *</label><Select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="mt-1 w-full" required><option value="">Select</option>{INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}</Select></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-medium">City</label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1" /></div><div><label className="text-sm font-medium">State</label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="mt-1" /></div></div>
          <div><label className="text-sm font-medium">Website</label><Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="mt-1" /></div>
          <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
          <Button type="submit" className="w-full">{editCompany ? 'Update' : 'Create'}</Button>
        </form>
      </Modal>
    </div>
  )
}
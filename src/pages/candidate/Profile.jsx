import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { updateUser } from '@/services/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [skills, setSkills] = useState(user?.skills || [])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', city: user?.city || '', state: user?.state || '', bio: user?.bio || '', education: user?.education || '', experienceYears: user?.experienceYears || 0 })

  const addSkill = () => { if (newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills([...skills, newSkill.trim()]); setNewSkill('') } }
  const removeSkill = (s) => setSkills(skills.filter(skill => skill !== s))

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const updated = updateUser(user.id, { ...form, skills })
    if (updated) {
      const newUser = { ...user, ...updated }
      setUser(newUser)
      toast.success('Profile updated!')
    } else {
      toast.error('Failed to update')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Full Name</label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Email</label><Input value={user?.email} disabled className="mt-1" /></div>
              <div><label className="text-sm font-medium">Phone</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
              <div><label className="text-sm font-medium">City</label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium">State</label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="mt-1" /></div>
            <div><label className="text-sm font-medium">Bio</label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="mt-1" placeholder="Tell us about yourself..." /></div>
          </CardContent></Card>
        <Card><CardHeader><CardTitle>Experience & Education</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Years of Experience</label><Input type="number" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: parseInt(e.target.value) || 0 })} className="mt-1 w-32" /></div>
            <div><label className="text-sm font-medium">Education</label><Input value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} className="mt-1" placeholder="Degree, Institution, Year" /></div>
          </CardContent></Card>
        <Card><CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">{skills.map(s => (<span key={s} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{s}<button type="button" onClick={() => removeSkill(s)}><X className="h-3 w-3" /></button></span>))}</div>
            <div className="flex gap-2"><Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} /><Button type="button" variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button></div>
          </CardContent></Card>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  )
}
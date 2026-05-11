import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, MapPin, FileText, Linkedin, Plus, X } from 'lucide-react'
import api from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(user?.profile)
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState(profile?.skills || [])
  const [newSkill, setNewSkill] = useState('')
  const { register, handleSubmit } = useForm({ defaultValues: profile })

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill))

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { data: res } = await api.put('/profile', { ...data, skills })
      setProfile(res.data.profile)
      toast.success('Profile updated!')
    } catch (e) { toast.error('Failed to update profile') }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Full Name</label><Input {...register('fullName')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Email</label><Input value={user?.email} disabled className="mt-1" /></div>
              <div><label className="text-sm font-medium">Phone</label><Input {...register('phone')} className="mt-1" /></div>
              <div><label className="text-sm font-medium">City</label><Input {...register('city')} className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium">State</label><Input {...register('state')} className="mt-1" /></div>
            <div><label className="text-sm font-medium">Bio</label><Textarea {...register('bio')} className="mt-1" placeholder="Tell us about yourself..." /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Experience & Education</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Years of Experience</label><Input type="number" {...register('experienceYears')} className="mt-1 w-32" /></div>
            <div><label className="text-sm font-medium">Education</label><Input {...register('education')} className="mt-1" placeholder="Degree, Institution, Year" /></div>
            <div><label className="text-sm font-medium">LinkedIn URL</label><Input {...register('linkedinUrl')} className="mt-1" placeholder="https://linkedin.com/in/..." /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">{skills.map(s => (<span key={s} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{s}<button type="button" onClick={() => removeSkill(s)}><X className="h-3 w-3" /></button></span>))}</div>
            <div className="flex gap-2"><Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} /><Button type="button" variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button></div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  )
}

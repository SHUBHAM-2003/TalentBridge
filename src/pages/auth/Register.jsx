import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import { createUser, getUserByEmail } from '@/services/storage'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    
    if (!email || !password || !form.fullName.value) { toast.error('Please fill all required fields'); return }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (getUserByEmail(email)) { toast.error('Email already registered'); return }
    
    setLoading(true)
    createUser({
      email, password, role: 'CANDIDATE', fullName: form.fullName.value,
      phone: form.phone.value, city: form.city.value, state: '',
      bio: '', skills: [], experienceYears: 0, education: '', profilePhotoUrl: null
    })
    toast.success('Account created! Please login.')
    navigate('/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-heading font-bold text-primary">Join TalentBridge</h1><p className="text-gray-500 mt-2">Create your candidate account</p></div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div><label className="text-sm font-medium">Full Name *</label><div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="fullName" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" placeholder="John Doe" required /></div></div>
            <div><label className="text-sm font-medium">Email *</label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="email" type="email" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" required /></div></div>
            <div><label className="text-sm font-medium">Password *</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="password" type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2.5 border rounded-lg" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff className="h-5 w-5" /></button></div></div>
            <div><label className="text-sm font-medium">Confirm Password *</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="confirmPassword" type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" required /></div></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Phone</label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="phone" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div></div>
              <div><label className="text-sm font-medium">City</label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="city" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div></div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50">{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></div>
        </div>
      </div>
    </div>
  )
}
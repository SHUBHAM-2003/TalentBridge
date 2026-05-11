import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const schema = z.object({
  fullName: z.string().min(2), email: z.string().email(), password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(), phone: z.string().optional(), city: z.string().optional()
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/register', data)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-heading font-bold text-primary">Join TalentBridge</h1><p className="text-gray-500 mt-2">Create your candidate account</p></div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="text-sm font-medium">Full Name</label><div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('fullName')} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" placeholder="John Doe" /></div>{errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}</div>
            <div><label className="text-sm font-medium">Email</label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('email')} type="email" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div>{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}</div>
            <div><label className="text-sm font-medium">Password</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2.5 border rounded-lg" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff className="h-5 w-5" /></button></div>{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}</div>
            <div><label className="text-sm font-medium">Confirm Password</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('confirmPassword')} type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div>{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Phone</label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('phone')} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div></div>
              <div><label className="text-sm font-medium">City</label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('city')} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div></div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50">{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></div>
        </div>
      </div>
    </div>
  )
}

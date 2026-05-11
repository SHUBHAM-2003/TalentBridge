import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({ email: z.string().email(), password: z.string().min(6) })

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(result.data.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (e) { toast.error(e.response?.data?.message || 'Login failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-heading font-bold text-primary">TalentBridge</h1><p className="text-gray-500 mt-2">Sign in to your account</p></div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('email')} type="email" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" placeholder="you@example.com" /></div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2.5 border rounded-lg" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff className="h-5 w-5" /></button></div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between text-sm"><Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link></div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link></div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Demo: admin@talentbridge.com / Admin@123</p>
      </div>
    </div>
  )
}

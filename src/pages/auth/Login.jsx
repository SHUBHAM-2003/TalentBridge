import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getUserByEmail } from '@/services/storage'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    
    if (!email || !password) { toast.error('Please fill all fields'); return }
    
    setLoading(true)
    const user = getUserByEmail(email)
    
    if (!user || user.password !== password) {
      toast.error('Invalid email or password')
      setLoading(false)
      return
    }
    
    login(user)
    toast.success('Welcome back!')
    navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-heading font-bold text-primary">TalentBridge</h1><p className="text-gray-500 mt-2">Sign in to your account</p></div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="email" type="email" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" placeholder="you@example.com" required /></div>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="password" type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2.5 border rounded-lg" placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff className="h-5 w-5" /></button></div>
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
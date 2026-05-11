import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const schema = z.object({ password: z.string().min(8), confirmPassword: z.string() }).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match" })

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password: data.password })
      toast.success('Password reset successful!')
      navigate('/login')
    } catch (e) { toast.error(e.response?.data?.message || 'Reset failed') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-heading font-bold text-primary">Set New Password</h1></div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div><label className="text-sm font-medium">New Password</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2.5 border rounded-lg" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff className="h-5 w-5" /></button></div>{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}</div>
            <div><label className="text-sm font-medium">Confirm Password</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('confirmPassword')} type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div>{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}</div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

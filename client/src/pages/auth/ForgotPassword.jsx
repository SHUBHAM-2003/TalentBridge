import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const schema = z.object({ email: z.string().email() })

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', data)
      setSent(true)
    } catch (e) { toast.error('Failed to send reset email') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-heading font-bold text-primary">Reset Password</h1><p className="text-gray-500 mt-2">{sent ? 'Check your email' : 'Enter your email to reset password'}</p></div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {sent ? <div className="text-center"><p className="text-gray-600">If an account exists with this email, you will receive a password reset link.</p></div>
           : <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div><label className="text-sm font-medium">Email</label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input {...register('email')} type="email" className="w-full pl-10 pr-4 py-2.5 border rounded-lg" /></div>{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}</div>
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>}
        </div>
      </div>
    </div>
  )
}

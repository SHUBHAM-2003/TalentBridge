import { forwardRef } from 'react'
import { cn } from '@/utils/utils'

const Button = forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-primary text-white hover:bg-primary-600',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    destructive: 'bg-error text-white hover:bg-red-600'
  }
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-6',
    icon: 'h-10 w-10'
  }
  return (
    <button ref={ref} className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)} {...props} />
  )
})
Button.displayName = 'Button'

export { Button }

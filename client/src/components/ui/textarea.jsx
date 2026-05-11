import { forwardRef } from 'react'
import { cn } from '@/utils/utils'

const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea className={cn('flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none', className)} ref={ref} {...props} />
))
Textarea.displayName = 'Textarea'

export { Textarea }

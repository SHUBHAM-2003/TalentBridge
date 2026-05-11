import { cn } from '@/utils/utils'

export function Avatar({ src, alt, className }) {
  if (!src) return null
  return <img src={src} alt={alt} className={cn('rounded-full object-cover', className)} />
}

export function AvatarFallback({ name, className }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  return (
    <div className={cn('rounded-full bg-primary flex items-center justify-center text-white font-medium', className)}>
      {initials}
    </div>
  )
}

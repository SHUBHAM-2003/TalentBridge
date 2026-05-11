import { cn } from '@/utils/utils'

export function Badge({ className, children, ...props }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)} {...props}>{children}</span>
}

export function Card({ className, ...props }) {
  return <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold text-secondary', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

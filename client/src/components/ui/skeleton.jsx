import { cn } from '@/utils/utils'
import { Loader2 } from 'lucide-react'

export function Spinner({ className, ...props }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} {...props} />
}

export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <Skeleton className="h-4 w-1/4 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

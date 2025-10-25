import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

const SkeletonProjectModelCard = () => {
  return (
    <div
      className='relative rounded-md border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-500'
      style={{ marginBottom: '0.5rem' }}
    >
      {/* Thumbnail skeleton */}
      <div className='flex h-32 items-center justify-center bg-gray-100'>
        <div className='flex h-20 w-20 animate-pulse items-center justify-center rounded bg-gray-300'>
          <span className='text-xs text-gray-400'>Loading...</span>
        </div>
      </div>

      {/* Title skeleton */}
      <div className='mt-2 h-5 w-3/4 animate-pulse rounded-md bg-gray-300'></div>

      {/* Status capsule and action buttons skeleton */}
      <div className='mt-1 flex items-center justify-between gap-1'>
        <div className='h-6 w-20 animate-pulse rounded-full bg-gray-300'></div>
        <div className='flex gap-1'>
          <div className='h-6 w-6 animate-pulse rounded-full bg-gray-300'></div>
          <div className='h-6 w-6 animate-pulse rounded-full bg-gray-300'></div>
          <div className='h-6 w-6 animate-pulse rounded-full bg-gray-300'></div>
        </div>
      </div>
    </div>
  )
}

export { Skeleton, SkeletonProjectModelCard }
export default SkeletonProjectModelCard

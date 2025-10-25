import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <h1
        className={cn(
          'text-xl font-medium tracking-tight text-gray-900',
          titleClassName
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            'text-base font-medium leading-relaxed text-gray-600',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default PageHeader

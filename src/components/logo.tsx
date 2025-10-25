const Logo = ({
  size = 'lg',
  color = 'text-gray-900',
  mdSize = 'xl',
  isCollapsed = false,
}: {
  size?: string
  color?: string
  mdSize?: string
  isCollapsed?: boolean
}) => {
  const sizeToHeight: Record<string, string> = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
    '2xl': 'h-14',
    '3xl': 'h-16',
    '4xl': 'h-20',
    '5xl': 'h-24',
  }
  const mdSizeToHeight: Record<string, string> = {
    sm: 'md:h-6',
    md: 'md:h-8',
    lg: 'md:h-10',
    xl: 'md:h-12',
    '2xl': 'md:h-14',
    '3xl': 'md:h-16',
    '4xl': 'md:h-20',
    '5xl': 'md:h-24',
  }
  const heightClass = sizeToHeight[size] || 'h-10'
  const mdHeightClass = mdSizeToHeight[mdSize] || 'md:h-12'

  if (isCollapsed) {
    return (
      <img src='/logo.png' alt='HYVE' className={`w-auto ${heightClass}`} />
    )
  }

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <img
        src='/logo.png'
        alt='HYVE'
        className={`w-auto ${heightClass} ${mdHeightClass}`}
      />
      <span className={`sr-only`}>HYVE</span>
    </div>
  )
}

export default Logo

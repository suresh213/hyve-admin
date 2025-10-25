import React from 'react'
import Logo from './logo'

const Loader: React.FC = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      {/* <img
        src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LinkedGro%20Logo%20(1)-6gVWJSKGtgPQXoni8F8zRZaY4Z8oM2.png'
        alt='Loading...'
        className='h-20 w-auto'
      /> */}
      <Logo size='5xl' color='text-gray-900' mdSize='5xl' />
    </div>
  )
}

export default Loader

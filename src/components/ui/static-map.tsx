import React, { useEffect, useRef } from 'react'
import { Card } from './card'

interface StaticMapProps {
  lat: number
  lng: number
  title?: string
  zoom?: number
  height?: string
  apiKey: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function StaticMap({
  lat,
  lng,
  title,
  zoom = 15,
  height = '300px',
  apiKey,
}: StaticMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = initMap
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [apiKey])

  const initMap = () => {
    if (!mapRef.current) return

    // Create map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      scrollwheel: false,
      gestureHandling: 'cooperative',
    })

    // Create marker
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title,
      animation: window.google.maps.Animation.DROP,
    })
  }

  return (
    <Card>
      <div ref={mapRef} style={{ height }} className='w-full rounded-md' />
    </Card>
  )
}

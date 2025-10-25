import { useEffect, useRef, useState } from 'react'
import { Input } from './input'
import { Search, MapPin } from 'lucide-react'

interface MapPickerProps {
  apiKey: string
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
  height?: string
  zoom?: number
}

declare global {
  interface Window {
    google: any
    initMap: () => void
    initMapPicker?: () => void
  }
}

const MapPicker = ({
  apiKey,
  onLocationSelect,
  initialLat = 20.5937,
  initialLng = 78.9629,
  height = '400px',
  zoom = 10,
}: MapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)

  // Initialize map
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap()
      return
    }

    // Check if script is already loading
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    )
    if (existingScript) {
      // Script is already loading, wait for it
      const checkGoogle = () => {
        if (window.google && window.google.maps) {
          initMap()
        } else {
          setTimeout(checkGoogle, 100)
        }
      }
      checkGoogle()
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapPicker`
    script.async = true
    script.defer = true

    // Define global callback
    window.initMapPicker = () => {
      initMap()
    }

    document.head.appendChild(script)

    return () => {
      // Clean up global callback
      if (window.initMapPicker) {
        delete window.initMapPicker
      }
    }
  }, [apiKey])

  const initMap = () => {
    if (!mapRef.current) return

    // Check if Google Maps and Places libraries are loaded
    if (
      !window?.google ||
      !window?.google?.maps ||
      !window?.google?.maps?.places
    ) {
      console.error('Google Maps or Places library not loaded')
      return
    }

    // Create map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: initialLat, lng: initialLng },
      zoom: zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    // Create marker
    const markerInstance = new window.google.maps.Marker({
      position: { lat: initialLat, lng: initialLng },
      map: mapInstance,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    })

    // Create search box
    const searchBoxInstance = new window.google.maps.places.SearchBox(
      searchInputRef.current as HTMLInputElement
    )

    // Bias search box results towards current map viewport
    mapInstance.addListener('bounds_changed', () => {
      searchBoxInstance.setBounds(mapInstance.getBounds())
    })

    // Listen for marker drag events
    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition()
      onLocationSelect(position.lat(), position.lng())
    })

    // Listen for search box events
    searchBoxInstance.addListener('places_changed', () => {
      const places = searchBoxInstance.getPlaces()
      if (places.length === 0) return

      const place = places[0]
      if (!place.geometry || !place.geometry.location) return

      // Update map and marker
      mapInstance.setCenter(place.geometry.location)
      mapInstance.setZoom(17)
      markerInstance.setPosition(place.geometry.location)
      onLocationSelect(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      )
    })

    setMap(mapInstance)
    setMarker(markerInstance)
  }

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (
      marker &&
      typeof initialLat === 'number' &&
      typeof initialLng === 'number'
    ) {
      const position = new window.google.maps.LatLng(initialLat, initialLng)
      marker.setPosition(position)
      map.panTo(position)
    }
  }, [initialLat, initialLng, marker, map])

  return (
    <div className='space-y-4'>
      <div className='relative border-none outline-none'>
        <Input
          ref={searchInputRef}
          type='text'
          placeholder='Search for a location...'
          className='pl-10 outline-none'
        />
        <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
      </div>
      <div ref={mapRef} className='h-[400px] w-full rounded-md border' />
      <div className='space-y-4'>
        <div className='flex items-center justify-between text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <MapPin className='h-4 w-4' />
            <span>Drag marker or search to set location</span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Latitude
            </label>
            <Input
              type='number'
              value={initialLat}
              onChange={(e) => {
                const lat = parseFloat(e.target.value)
                if (!isNaN(lat)) {
                  onLocationSelect(lat, initialLng)
                }
              }}
              step='any'
              className='text-sm'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Longitude
            </label>
            <Input
              type='number'
              value={initialLng}
              onChange={(e) => {
                const lng = parseFloat(e.target.value)
                if (!isNaN(lng)) {
                  onLocationSelect(initialLat, lng)
                }
              }}
              step='any'
              className='text-sm'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPicker

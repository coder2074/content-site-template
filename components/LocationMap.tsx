// components/LocationMap.tsx
// Client-only — always imported via dynamic() with ssr: false.
// Uses react-leaflet + OpenStreetMap tiles (no API key needed).
'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default marker icon broken by webpack
// https://github.com/Leaflet/Leaflet/issues/4968
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

interface Place {
  name: string
  lat: number
  lng: number
  address?: string
}

interface LocationMapProps {
  center: string
  places: Place[]
}

export default function LocationMap({ center, places }: LocationMapProps) {
  useEffect(() => {
    fixLeafletIcon()
  }, [])

  // Compute map center from average of coordinates
  const validPlaces = places.filter((p) => p.lat && p.lng)

  if (validPlaces.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">No location data available</span>
      </div>
    )
  }

  const avgLat = validPlaces.reduce((sum, p) => sum + p.lat, 0) / validPlaces.length
  const avgLng = validPlaces.reduce((sum, p) => sum + p.lng, 0) / validPlaces.length

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[avgLat, avgLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPlaces.map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lng]}>
            <Popup>
              <div className="font-semibold">{place.name}</div>
              {place.address && (
                <div className="text-sm text-gray-600 mt-1">{place.address}</div>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                Open in Google Maps →
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

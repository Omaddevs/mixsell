import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { formatMapPrice } from './MapListingPopup'

function pillIcon(label, selected) {
  return L.divIcon({
    className: 'map-pill-wrap',
    html: `<span class="map-pill${selected ? ' is-on' : ''}">${label}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    tooltipAnchor: [0, -38],
  })
}

export default function MapPlaceMarker({ listing, selected, onSelect }) {
  const icon = useMemo(() => pillIcon(formatMapPrice(listing), selected), [listing, selected])

  return (
    <Marker
      position={[listing.lat, listing.lng]}
      icon={icon}
      zIndexOffset={selected ? 900 : 0}
      eventHandlers={{ click: () => onSelect(listing.id) }}
    />
  )
}

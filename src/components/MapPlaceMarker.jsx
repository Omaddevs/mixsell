import { useEffect, useRef } from 'react'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import MapListingPopup from './MapListingPopup'

const ringOff = L.divIcon({
  className: 'map-ring',
  html: '<span class="map-ring-dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -16],
  tooltipAnchor: [0, -12],
})

const ringOn = L.divIcon({
  className: 'map-ring is-on',
  html: '<span class="map-ring-dot"></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -18],
  tooltipAnchor: [0, -14],
})

export function mapPreviewIds(listings, limit = 3) {
  const preferred = listings.filter((item) => item.vip || item.isTop)
  const pool = preferred.length ? preferred : listings
  return new Set(pool.slice(0, limit).map((item) => item.id))
}

export default function MapPlaceMarker({ listing, selected, showThumb, onSelect }) {
  const markerRef = useRef(null)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return
    if (selected) marker.openPopup?.()
    else marker.closePopup?.()
  }, [selected])

  return (
    <Marker
      ref={markerRef}
      position={[listing.lat, listing.lng]}
      icon={selected ? ringOn : ringOff}
      zIndexOffset={selected ? 900 : showThumb ? 300 : 0}
      eventHandlers={{ click: () => onSelect(listing.id) }}
    >
      {showThumb && !selected ? (
        <Tooltip permanent direction="top" offset={[0, -10]} className="map-thumb-tip" opacity={1}>
          <span className="map-thumb">
            <img src={listing.image} alt="" />
          </span>
        </Tooltip>
      ) : null}
      <Popup className="map-bubble-popup" closeButton={false} autoPan>
        <MapListingPopup listing={listing} />
      </Popup>
    </Marker>
  )
}

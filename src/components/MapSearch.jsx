import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, X } from 'lucide-react'
import MapFeedCard from './MapFeedCard'
import MapHud from './MapHud'
import MapPlaceMarker, { mapPreviewIds } from './MapPlaceMarker'

const NY_CENTER = [42.95, -76.8]

const youIcon = L.divIcon({
  className: 'you-marker',
  html: '<span class="you-dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function MapController({ listings, selected, flyToken, userPos }) {
  const map = useMap()
  const listingKey = listings.map((item) => item.id).join(',')
  const posRef = useRef(userPos)
  posRef.current = userPos

  useEffect(() => {
    const t1 = window.setTimeout(() => map.invalidateSize(), 80)
    const t2 = window.setTimeout(() => map.invalidateSize(), 280)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [map])

  useEffect(() => {
    const points = listings.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
    if (!points.length) {
      map.setView(NY_CENTER, 7)
      return
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 13)
      return
    }
    map.fitBounds(
      L.latLngBounds(points.map((item) => [item.lat, item.lng])),
      { padding: [40, 40], maxZoom: 12 },
    )
  }, [listingKey, listings, map])

  useEffect(() => {
    if (!selected || !Number.isFinite(selected.lat)) return
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 14), { duration: 0.6 })
  }, [selected, map])

  useEffect(() => {
    const pos = posRef.current
    if (!flyToken || !pos) return
    map.flyTo([pos.lat, pos.lng], 14, { duration: 0.75 })
  }, [flyToken, map])

  return null
}

function BoundsWatcher({ onChange }) {
  const map = useMap()

  useEffect(() => {
    const emit = () => onChange(map.getBounds())
    emit()
    map.on('moveend', emit)
    return () => map.off('moveend', emit)
  }, [map, onChange])

  return null
}

export default function MapSearch({ listings, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [bounds, setBounds] = useState(null)
  const [inViewOnly, setInViewOnly] = useState(true)
  const [locating, setLocating] = useState(false)
  const [userPos, setUserPos] = useState(null)
  const [flyToken, setFlyToken] = useState(0)
  const listRef = useRef(null)

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return listings
    return listings.filter((item) =>
      `${item.street} ${item.city} ${item.title ?? ''} ${item.ownerName ?? ''}`.toLowerCase().includes(q),
    )
  }, [listings, query])

  const visible = useMemo(() => {
    if (!inViewOnly || !bounds) return searched
    return searched.filter(
      (item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && bounds.contains([item.lat, item.lng]),
    )
  }, [searched, bounds, inViewOnly])

  const selected = searched.find((item) => item.id === selectedId) ?? null
  const previewIds = useMemo(() => mapPreviewIds(searched), [searched])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    if (!selectedId) return
    const node = listRef.current?.querySelector(`[data-listing-id="${selectedId}"]`)
    node?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

  function locate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPos({ lat: position.coords.latitude, lng: position.coords.longitude })
        setFlyToken((value) => value + 1)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return createPortal(
    <div className="map-search" role="dialog" aria-modal="true" aria-labelledby="map-search-title">
      <header className="map-search-bar">
        <div>
          <p className="map-search-kicker">Map search</p>
          <h2 id="map-search-title">Xarita bilan qidirish</h2>
        </div>
        <label className="map-search-input">
          <Search size={16} strokeWidth={2} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Manzil, uy yoki foydalanuvchi..."
            aria-label="Xaritadan qidirish"
          />
        </label>
        <label className="map-search-toggle">
          <input type="checkbox" checked={inViewOnly} onChange={(event) => setInViewOnly(event.target.checked)} />
          Faqat xaritadagi
        </label>
        <button type="button" className="map-search-close" onClick={onClose} aria-label="Yopish">
          <X size={18} />
        </button>
      </header>

      <div className="map-search-body">
        <aside className="map-search-list" ref={listRef}>
          <p className="map-search-count">{visible.length} ta e’lon</p>
          {visible.length ? (
            <div className="map-search-grid">
              {visible.map((listing) => (
                <div key={listing.id} data-listing-id={listing.id}>
                  <MapFeedCard
                    listing={listing}
                    selected={listing.id === selectedId}
                    onSelect={() => setSelectedId(listing.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="map-search-empty">Bu hududda e’lon yo‘q. Xaritani siljiting yoki filterni o‘zgartiring.</p>
          )}
        </aside>

        <div className="map-search-canvas">
          <MapContainer
            center={NY_CENTER}
            zoom={7}
            scrollWheelZoom
            zoomControl={false}
            attributionControl={false}
            className="map-search-leaflet"
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapController listings={searched} selected={selected} flyToken={flyToken} userPos={userPos} />
            <BoundsWatcher onChange={setBounds} />
            <MapHud locating={locating} userPos={userPos} onLocate={locate} />
            {searched.map((listing) =>
              Number.isFinite(listing.lat) && Number.isFinite(listing.lng) ? (
                <MapPlaceMarker
                  key={listing.id}
                  listing={listing}
                  selected={listing.id === selectedId}
                  showThumb={previewIds.has(listing.id)}
                  onSelect={setSelectedId}
                />
              ) : null,
            )}
            {userPos ? (
              <>
                <Circle
                  center={[userPos.lat, userPos.lng]}
                  radius={180}
                  pathOptions={{ color: '#1363d2', fillColor: '#1363d2', fillOpacity: 0.12, weight: 1 }}
                />
                <Marker position={[userPos.lat, userPos.lng]} icon={youIcon} zIndexOffset={1000} />
              </>
            ) : null}
          </MapContainer>
        </div>
      </div>
    </div>,
    document.body,
  )
}

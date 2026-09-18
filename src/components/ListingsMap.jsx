import { useEffect, useMemo, useRef, useState } from 'react'
import { AttributionControl, Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Navigation, X } from 'lucide-react'
import MapHud from './MapHud'
import MapListingPopup from './MapListingPopup'
import MapPlaceMarker from './MapPlaceMarker'

const TASHKENT_CENTER = [41.311, 69.279]
const DEFAULT_ZOOM = 12

const youIcon = L.divIcon({
  className: 'you-marker',
  html: '<span class="you-dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function fitListings(map, listings) {
  const points = listings.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
  if (!points.length) {
    map.setView(TASHKENT_CENTER, DEFAULT_ZOOM)
    return
  }
  if (points.length === 1) {
    map.setView([points[0].lat, points[0].lng], 13)
    return
  }
  map.fitBounds(
    L.latLngBounds(points.map((item) => [item.lat, item.lng])),
    { padding: [48, 48], maxZoom: 12 },
  )
}

function MapEffects({ listings, selected, userPos, flyToken, fullscreen, focusNonce, homesToken }) {
  const map = useMap()
  const listingKey = listings.map((item) => item.id).join(',')
  const userPosRef = useRef(userPos)
  userPosRef.current = userPos

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 80)
    const later = window.setTimeout(() => map.invalidateSize(), 280)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(later)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [map, fullscreen])

  useEffect(() => {
    fitListings(map, listings)
  }, [listingKey, listings, map])

  useEffect(() => {
    if (!homesToken) return
    fitListings(map, listings)
  }, [homesToken, listings, map])

  useEffect(() => {
    if (!focusNonce || !selected || !Number.isFinite(selected.lat)) return
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 13), { duration: 0.7 })
  }, [focusNonce, selected, map])

  useEffect(() => {
    const pos = userPosRef.current
    if (!flyToken || !pos) return
    map.flyTo([pos.lat, pos.lng], 14, { duration: 0.8 })
  }, [flyToken, map])

  return null
}

export default function ListingsMap({ listings, selectedId, focusNonce = 0, onSelect }) {
  const [fullscreen, setFullscreen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [userPos, setUserPos] = useState(null)
  const [flyToken, setFlyToken] = useState(0)
  const [homesToken, setHomesToken] = useState(0)
  const watchId = useRef(null)

  const selected = useMemo(
    () => listings.find((item) => item.id === selectedId) ?? null,
    [listings, selectedId],
  )

  useEffect(() => {
    if (!fullscreen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setFullscreen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [fullscreen])

  useEffect(() => {
    return () => {
      if (watchId.current != null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current)
      }
    }
  }, [])

  useEffect(() => {
    locateUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applyPosition(coords) {
    setUserPos({
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy,
    })
    setGeoError('')
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setGeoError('This browser does not support location.')
      return
    }

    if (userPos) {
      setFlyToken((value) => value + 1)
      return
    }

    setLocating(true)
    setGeoError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyPosition(position.coords)
        setLocating(false)
        setFlyToken((value) => value + 1)
        if (watchId.current == null) {
          watchId.current = navigator.geolocation.watchPosition(
            (next) => applyPosition(next.coords),
            () => {},
            { enableHighAccuracy: true, maximumAge: 8000 },
          )
        }
      },
      (error) => {
        setLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Allow location access in your browser to see yourself on the map.')
        } else if (error.code === error.TIMEOUT) {
          setGeoError('Location request timed out. Try again.')
        } else {
          setGeoError('Could not read your location. Try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 },
    )
  }

  function clearLocation() {
    if (watchId.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    setUserPos(null)
    setGeoError('')
  }

  return (
    <aside className={`listings-map${fullscreen ? ' is-fullscreen' : ''}`} aria-label="Map view">
      <div className="listings-map-inner">
        <MapContainer
          center={TASHKENT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          zoomControl={false}
          attributionControl={false}
          className="listings-leaflet"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains="abc"
            maxZoom={19}
            attribution="&copy; OpenStreetMap contributors"
          />
          <AttributionControl position="bottomleft" prefix={false} />
          <MapEffects
            listings={listings}
            selected={selected}
            userPos={userPos}
            flyToken={flyToken}
            fullscreen={fullscreen}
            focusNonce={focusNonce}
            homesToken={homesToken}
          />
          <MapHud
            locating={locating}
            userPos={userPos}
            onLocate={locateUser}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen((value) => !value)}
          />

          {listings.map((listing) =>
            Number.isFinite(listing.lat) && Number.isFinite(listing.lng) ? (
              <MapPlaceMarker
                key={listing.id}
                listing={listing}
                selected={listing.id === selectedId}
                onSelect={onSelect}
              />
            ) : null,
          )}

          {userPos ? (
            <>
              {userPos.accuracy ? (
                <Circle
                  center={[userPos.lat, userPos.lng]}
                  radius={Math.min(userPos.accuracy, 400)}
                  pathOptions={{
                    color: '#1363d2',
                    weight: 1,
                    fillColor: '#4394fd',
                    fillOpacity: 0.12,
                  }}
                />
              ) : null}
              <Marker position={[userPos.lat, userPos.lng]} icon={youIcon} zIndexOffset={800}>
                <Popup>You are here</Popup>
              </Marker>
            </>
          ) : null}
        </MapContainer>

        {selected ? <MapListingPopup listing={selected} onClose={() => onSelect(null)} /> : null}

        <p className="map-region-label">Toshkent</p>

        <button
          type="button"
          className={`map-near-btn${locating ? ' is-busy' : ''}`}
          onClick={() => setFlyToken((value) => value + 1)}
          disabled={!userPos}
          title={
            userPos
              ? 'Joylashuvingizga yaqin e’lonlarni ko‘rsatish'
              : 'Joylashuvga ruxsat berilgandan so‘ng ishlaydi'
          }
        >
          <Navigation size={16} strokeWidth={2.2} />
          {locating && !userPos ? 'Aniqlanmoqda...' : 'Menga yaqin'}
        </button>

        {userPos ? (
          <div className="map-chip-row">
            <button type="button" className="map-you-chip" onClick={clearLocation}>
              You are on the map
              <X size={12} strokeWidth={2.4} />
            </button>
            <button type="button" className="map-you-chip" onClick={() => setHomesToken((value) => value + 1)}>
              Show homes
            </button>
          </div>
        ) : null}

        {geoError ? (
          <p className="map-toast" role="status">
            {geoError}
          </p>
        ) : null}
      </div>
    </aside>
  )
}

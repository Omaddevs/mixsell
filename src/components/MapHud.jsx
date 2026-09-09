import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Crosshair, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

export default function MapHud({
  locating,
  userPos,
  onLocate,
  fullscreen = false,
  onToggleFullscreen,
}) {
  const map = useMap()
  const rootRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    L.DomEvent.disableClickPropagation(el)
    L.DomEvent.disableScrollPropagation(el)
  }, [])

  return createPortal(
    <div className="map-controls" ref={rootRef}>
      <button
        type="button"
        className={`map-tool-btn${userPos ? ' is-on' : ''}${locating ? ' is-busy' : ''}`}
        onClick={onLocate}
        aria-label="Mening joylashuvim"
        title="Mening joylashuvim"
        disabled={locating}
      >
        <Crosshair size={18} strokeWidth={2.1} />
      </button>
      <div className="map-zoom-stack">
        <button type="button" className="map-tool-btn" onClick={() => map.zoomIn()} aria-label="Yaqinlashtirish">
          <Plus size={18} strokeWidth={2.2} />
        </button>
        <button type="button" className="map-tool-btn" onClick={() => map.zoomOut()} aria-label="Uzoqlashtirish">
          <Minus size={18} strokeWidth={2.2} />
        </button>
      </div>
      {onToggleFullscreen ? (
        <button
          type="button"
          className="map-tool-btn"
          onClick={onToggleFullscreen}
          aria-label={fullscreen ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran'}
          title={fullscreen ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran'}
        >
          {fullscreen ? <Minimize2 size={18} strokeWidth={2.1} /> : <Maximize2 size={18} strokeWidth={2.1} />}
        </button>
      ) : null}
    </div>,
    map.getContainer(),
  )
}

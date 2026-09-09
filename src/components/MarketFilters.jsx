import { useEffect, useRef, useState } from 'react'
import { Building2, Calendar, ChevronDown, Clock, Landmark, MapPin, User } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'

export const DEAL_TABS = [
  { id: 'sale', label: 'Sotuv' },
  { id: 'rent', label: 'Ijara' },
  { id: 'daily', label: 'Kunlik' },
]

export const PROPERTY_TYPES = [
  { id: 'all', label: 'Barcha turlar' },
  { id: 'apartment', label: 'Kvartira' },
  { id: 'house', label: 'Hovli' },
  { id: 'dacha', label: 'Dacha' },
  { id: 'hotel', label: 'Mehmonxona' },
  { id: 'land', label: 'Quruq yer' },
]

export default function MarketFilters({
  deal,
  onDealChange,
  category,
  onCategoryChange,
  ownerOnly,
  onOwnerOnlyChange,
  mortgageOnly,
  onMortgageOnlyChange,
  period,
  onPeriodChange,
  onOpenMapSearch,
}) {
  const [typeOpen, setTypeOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const typeRef = useRef(null)
  const locateTimer = useRef(null)
  const typeLabel = PROPERTY_TYPES.find((item) => item.id === category)?.label ?? 'Ko‘chmas mulk turi'

  useClickOutside(typeRef, () => setTypeOpen(false), typeOpen)

  useEffect(() => {
    return () => window.clearTimeout(locateTimer.current)
  }, [])

  function launchMap() {
    if (locating) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onOpenMapSearch?.()
      return
    }
    setLocating(true)
    locateTimer.current = window.setTimeout(() => {
      setLocating(false)
      onOpenMapSearch?.()
    }, 1200)
  }

  return (
    <div className="market-filters">
      <div className="deal-tabs-row">
        <div className="deal-tabs" role="tablist" aria-label="E’lon turi">
          {DEAL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={deal === tab.id}
              className={`deal-tab${deal === tab.id ? ' is-on' : ''}`}
              onClick={() => onDealChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`map-search-launch${locating ? ' is-locating' : ''}`}
          onClick={launchMap}
          disabled={locating}
          aria-label="Xarita bilan qidirish"
          title="Xarita bilan qidirish"
        >
          <span className="map-search-launch-fill" aria-hidden="true" />
          <span className="map-search-launch-disc">
            <span className="map-search-launch-radar" aria-hidden="true" />
            <MapPin size={18} strokeWidth={2.2} />
          </span>
          <span className="map-search-launch-text">
            {locating ? 'Qidirilmoqda...' : 'Xarita bilan qidirish'}
          </span>
        </button>
      </div>

      <div className="filter-chips">
        <div className="type-filter" ref={typeRef}>
          <button
            type="button"
            className={`filter-chip${category !== 'all' ? ' is-on' : ''}`}
            aria-expanded={typeOpen}
            aria-haspopup="listbox"
            onClick={() => setTypeOpen((value) => !value)}
          >
            <Building2 size={16} strokeWidth={2} />
            <span>{category === 'all' ? 'Ko‘chmas mulk turi' : typeLabel}</span>
            <ChevronDown size={14} strokeWidth={2.2} />
          </button>
          {typeOpen ? (
            <div className="type-menu" role="listbox" aria-label="Ko‘chmas mulk turi">
              {PROPERTY_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={category === item.id}
                  className={`type-option${category === item.id ? ' is-active' : ''}`}
                  onClick={() => {
                    onCategoryChange(item.id)
                    setTypeOpen(false)
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={`filter-chip${ownerOnly ? ' is-on' : ''}`}
          aria-pressed={ownerOnly}
          onClick={() => onOwnerOnlyChange(!ownerOnly)}
        >
          <User size={16} strokeWidth={2} />
          Egasi
        </button>

        <button
          type="button"
          className={`filter-chip${mortgageOnly ? ' is-on' : ''}`}
          aria-pressed={mortgageOnly}
          onClick={() => onMortgageOnlyChange(!mortgageOnly)}
        >
          <Landmark size={16} strokeWidth={2} />
          Ipotekaga mumkin
        </button>

        <button
          type="button"
          className={`filter-chip${period === 'week' ? ' is-on' : ''}`}
          aria-pressed={period === 'week'}
          onClick={() => onPeriodChange(period === 'week' ? 'any' : 'week')}
        >
          <Clock size={16} strokeWidth={2} />
          Oxirgi hafta
        </button>

        <button
          type="button"
          className={`filter-chip${period === 'month' ? ' is-on' : ''}`}
          aria-pressed={period === 'month'}
          onClick={() => onPeriodChange(period === 'month' ? 'any' : 'month')}
        >
          <Calendar size={16} strokeWidth={2} />
          Oxirgi oy
        </button>
      </div>
    </div>
  )
}

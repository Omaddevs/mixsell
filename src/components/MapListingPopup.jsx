import { Bath, BedDouble, Bookmark, Heart, Phone, Ruler, Send, X } from 'lucide-react'
import { useListingEngagement } from '../context/EngagementContext'

const PHONE_HREF = 'tel:+998555888111'

export function formatMapPrice(listing) {
  const value = `$${listing.price.toLocaleString('en-US')}`
  if (listing.deal === 'rent') return `${value}/oy`
  if (listing.deal === 'daily') return `${value}/kun`
  return value
}

export function mapListingTitle(listing) {
  if (listing.title) return listing.title
  if (listing.beds) return `${listing.beds}-xonali kvartira`
  return listing.street || listing.city
}

export default function MapListingPopup({ listing, onClose }) {
  const { liked, saved, toggleLike, toggleSave, addShare } = useListingEngagement(listing)

  async function share(event) {
    event.stopPropagation()
    const title = mapListingTitle(listing)
    const text = `${title} — MixSells`
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href })
        addShare()
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`)
      addShare()
    } catch {
      // clipboard unavailable — nothing more we can do here
    }
  }

  return (
    <article className="map-bubble" onClick={(event) => event.stopPropagation()}>
      <div className="map-bubble-handle" aria-hidden="true" />
      <button type="button" className="map-bubble-close" onClick={onClose} aria-label="Yopish">
        <X size={16} strokeWidth={2.2} />
      </button>

      <div className="map-bubble-photo">
        <img src={listing.image} alt="" />
        <span className="map-bubble-badge">{listing.ownerName || listing.posted || mapListingTitle(listing)}</span>
      </div>

      <div className="map-bubble-copy">
        <p className="map-bubble-price">{formatMapPrice(listing)}</p>
        <p className="map-bubble-title">{mapListingTitle(listing)}</p>
        <p className="map-bubble-addr">{listing.street ? `${listing.street}, ${listing.city}` : listing.city}</p>

        {listing.beds != null ? (
          <div className="map-bubble-specs">
            <span>
              <BedDouble size={13} strokeWidth={1.8} />
              {listing.beds}
            </span>
            <span>
              <Bath size={13} strokeWidth={1.8} />
              {listing.baths}
            </span>
            <span>
              <Ruler size={13} strokeWidth={1.8} />
              {listing.sqft?.toLocaleString()} ft
            </span>
          </div>
        ) : null}

        <div className="map-bubble-actions">
          <button
            type="button"
            className={`map-bubble-icon${liked ? ' is-on' : ''}`}
            aria-label="Yoqtirish"
            aria-pressed={liked}
            onClick={(event) => {
              event.stopPropagation()
              toggleLike()
            }}
          >
            <Heart size={17} strokeWidth={1.8} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            className={`map-bubble-icon${saved ? ' is-on' : ''}`}
            aria-label="Saqlash"
            aria-pressed={saved}
            onClick={(event) => {
              event.stopPropagation()
              toggleSave()
            }}
          >
            <Bookmark size={17} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className="map-bubble-icon" aria-label="Ulashish" onClick={share}>
            <Send size={17} strokeWidth={1.8} />
          </button>
        </div>

        <div className="map-bubble-cta">
          <a className="map-bubble-btn map-bubble-btn--dark" href={PHONE_HREF}>
            <Phone size={15} strokeWidth={2.1} />
            Qo‘ng‘iroq qilish
          </a>
          <button
            type="button"
            className={`map-bubble-btn map-bubble-btn--brand${saved ? ' is-on' : ''}`}
            onClick={(event) => {
              event.stopPropagation()
              toggleSave()
            }}
          >
            <Bookmark size={15} strokeWidth={2.1} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saqlangan' : 'Saqlash'}
          </button>
        </div>
      </div>
    </article>
  )
}

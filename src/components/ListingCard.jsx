import { Bath, BedDouble, Crown, Ruler, User } from 'lucide-react'
import PostActions from './PostActions'
import SaveButton from './SaveButton'
import { useListingEngagement } from '../context/EngagementContext'

function formatPrice(listing) {
  const value = `$${listing.price.toLocaleString('en-US')}`
  if (listing.deal === 'rent') return `${value}/oy`
  if (listing.deal === 'daily') return `${value}/kun`
  return value
}

export default function ListingCard({ listing, selected = false, onSelect, vip = false }) {
  const { likeOnly } = useListingEngagement(listing)

  function likeFromPhoto(event) {
    event.stopPropagation()
    event.preventDefault()
    likeOnly()
  }

  return (
    <article
      id={`listing-${listing.id}`}
      className={`listing-card${selected ? ' is-selected' : ''}${onSelect ? ' is-selectable' : ''}${vip ? ' is-vip' : ''}`}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect()
              }
            }
          : undefined
      }
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="listing-photo" onDoubleClick={likeFromPhoto}>
        <img src={listing.image} alt={listing.street} />
        <div className="listing-badges">
          <span className="badge-owner">
            <User size={11} strokeWidth={2.2} />
            {listing.ownerName}
          </span>
          {vip ? (
            <span className="badge-vip">
              <Crown size={10} strokeWidth={2.2} />
              VIP
            </span>
          ) : (
            <span className="badge-time">{listing.posted}</span>
          )}
        </div>
        <SaveButton listing={listing} className="save-photo-btn" size={18} />
      </div>

      <div className="listing-specs">
        <span>
          <BedDouble size={12} strokeWidth={1.7} />
          {listing.beds} Beds
        </span>
        <span>
          <Bath size={12} strokeWidth={1.7} />
          {listing.baths} Baths
        </span>
        <span>
          <Ruler size={12} strokeWidth={1.7} />
          {listing.sqft.toLocaleString()} Ft
        </span>
      </div>

      <div className="listing-foot">
        <p className="listing-price">{formatPrice(listing)}</p>
        <div className="listing-address">
          <p className="listing-street">{listing.street}</p>
          <p className="listing-city">{listing.city}</p>
        </div>
      </div>

      <PostActions listing={listing} compact />
    </article>
  )
}

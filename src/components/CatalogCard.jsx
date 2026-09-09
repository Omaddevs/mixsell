import { ChevronUp, User } from 'lucide-react'
import PostActions from './PostActions'
import SaveButton from './SaveButton'
import { useListingEngagement } from '../context/EngagementContext'

function formatPrice(listing) {
  const value = `$${listing.price.toLocaleString('en-US')}`
  if (listing.deal === 'rent') return `${value}/oy`
  if (listing.deal === 'daily') return `${value}/kun`
  return value
}

export default function CatalogCard({ listing }) {
  const { likeOnly } = useListingEngagement(listing)

  return (
    <article className="catalog-card">
      <div
        className="catalog-photo"
        onDoubleClick={(event) => {
          event.preventDefault()
          likeOnly()
        }}
      >
        <img src={listing.image} alt={listing.title} />
        <span className="badge-owner">
          <User size={12} strokeWidth={2.2} />
          {listing.ownerName}
        </span>
        {listing.isTop ? (
          <span className="badge-top">
            <ChevronUp size={12} strokeWidth={2.6} />
            TOP
          </span>
        ) : null}
        <SaveButton listing={listing} className="save-photo-btn" size={18} />
      </div>

      <div className="catalog-body">
        <p className="catalog-price">{formatPrice(listing)}</p>
        <p className="catalog-title">{listing.title}</p>
        <p className="catalog-place">{listing.city}</p>
        <p className="catalog-time">{listing.posted}</p>
      </div>

      <PostActions listing={listing} />
    </article>
  )
}

import { Bath, BedDouble, Ruler } from 'lucide-react'
import SaveButton from './SaveButton'
import { formatMapPrice, mapListingTitle } from './MapListingPopup'

export default function MapFeedCard({ listing, selected = false, onSelect }) {
  return (
    <article data-listing-id={listing.id} className={`map-feed-card${selected ? ' is-on' : ''}`}>
      <button type="button" className="map-feed-main" onClick={onSelect}>
        <div className="map-feed-photo">
          <img src={listing.image} alt={mapListingTitle(listing)} />
        </div>
        <h3>{mapListingTitle(listing)}</h3>
        <p className="map-feed-price">{formatMapPrice(listing)}</p>
        <p className="map-feed-addr">{listing.street || listing.city}</p>
        {listing.beds != null ? (
          <div className="map-feed-specs">
            <span>
              <Bath size={12} strokeWidth={1.8} />
              {listing.baths} baths
            </span>
            <span>
              <BedDouble size={12} strokeWidth={1.8} />
              {listing.beds} beds
            </span>
            <span>
              <Ruler size={12} strokeWidth={1.8} />
              {listing.sqft.toLocaleString()} ft
            </span>
          </div>
        ) : null}
      </button>
      <SaveButton listing={listing} className="map-feed-save" size={16} />
    </article>
  )
}

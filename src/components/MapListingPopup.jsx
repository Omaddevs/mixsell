import SaveButton from './SaveButton'

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

export default function MapListingPopup({ listing }) {
  return (
    <article className="map-bubble">
      <img src={listing.image} alt="" />
      <div className="map-bubble-copy">
        <p className="map-bubble-price">{formatMapPrice(listing)}</p>
        <p className="map-bubble-addr">{listing.street || listing.title}</p>
      </div>
      <SaveButton listing={listing} className="map-bubble-save" size={16} />
    </article>
  )
}

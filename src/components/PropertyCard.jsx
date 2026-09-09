import { Bath, BedDouble, Maximize2 } from 'lucide-react'

function formatPrice(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function PropertyCard({ property }) {
  return (
    <article className="property-card">
      <img src={property.image} alt={property.title} />
      <div className="property-body">
        <p className="property-price">{formatPrice(property.price)}</p>
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">{property.location}</p>
        <div className="property-meta">
          <span>
            <Maximize2 size={11} />
            {property.sqft.toLocaleString()}
          </span>
          <span>
            <BedDouble size={11} />
            {property.beds}
          </span>
          <span>
            <Bath size={11} />
            {property.baths}
          </span>
        </div>
      </div>
    </article>
  )
}

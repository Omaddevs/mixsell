import { ChevronUp, User } from 'lucide-react'
import PostActions from './PostActions'
import SaveButton from './SaveButton'
import { useListingEngagement } from '../context/EngagementContext'

function formatPrice(car) {
  const value = `$${car.price.toLocaleString('en-US')}`
  if (car.deal === 'rent') return `${value}/kun`
  return value
}

function formatKm(value) {
  return `${value.toLocaleString('en-US')} km`
}

export default function CarCard({ car, compact = false }) {
  const { likeOnly } = useListingEngagement(car)

  return (
    <article className={`car-card${compact ? ' is-compact' : ''}`}>
      <div
        className="catalog-photo"
        onDoubleClick={(event) => {
          event.preventDefault()
          likeOnly()
        }}
      >
        <img src={car.image} alt={car.title} />
        <span className="badge-owner">
          <User size={12} strokeWidth={2.2} />
          {car.ownerName}
        </span>
        {car.vip ? <span className="badge-top">VIP</span> : null}
        {car.isTop ? (
          <span className="badge-top">
            <ChevronUp size={12} strokeWidth={2.6} />
            TOP
          </span>
        ) : null}
        <SaveButton listing={car} className="save-photo-btn" size={18} />
      </div>

      <div className="catalog-body">
        <p className="catalog-price">{formatPrice(car)}</p>
        <p className="catalog-title">{car.title}</p>
        <div className="car-specs">
          <span>{car.year}</span>
          <span>{formatKm(car.mileage)}</span>
          <span>{car.transmission}</span>
          <span>{car.fuel}</span>
        </div>
        <p className="catalog-place">{car.city}</p>
        <p className="catalog-time">{car.posted}</p>
      </div>

      <PostActions listing={car} compact={compact} />
    </article>
  )
}

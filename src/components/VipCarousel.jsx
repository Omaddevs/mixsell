import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ListingCard from './ListingCard'

export default function VipCarousel({ listings, selectedId, onSelect }) {
  const scrollerRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  function updateButtons() {
    const el = scrollerRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 12)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 12)
  }

  useEffect(() => {
    updateButtons()
    const el = scrollerRef.current
    if (!el) return undefined
    const onResize = () => updateButtons()
    window.addEventListener('resize', onResize)
    const timer = window.setTimeout(updateButtons, 80)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
    }
  }, [listings])

  function scrollByCards(direction) {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector('.listing-card')
    const gap = 14
    const step = ((card?.getBoundingClientRect().width || 220) + gap) * 5
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  if (!listings.length) {
    return <p className="listings-empty">No listings match those filters.</p>
  }

  return (
    <div className="vip-carousel">
      <button
        type="button"
        className="vip-nav vip-nav--prev"
        onClick={() => scrollByCards(-1)}
        disabled={!canPrev}
        aria-label="Previous VIP listings"
      >
        <ChevronLeft size={20} strokeWidth={2.2} />
      </button>

      <div
        className="vip-carousel-track"
        ref={scrollerRef}
        onScroll={updateButtons}
        aria-label="VIP listings carousel"
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            selected={listing.id === selectedId}
            onSelect={onSelect ? () => onSelect(listing.id) : undefined}
            vip
          />
        ))}
      </div>

      <button
        type="button"
        className="vip-nav vip-nav--next"
        onClick={() => scrollByCards(1)}
        disabled={!canNext}
        aria-label="Next VIP listings"
      >
        <ChevronRight size={20} strokeWidth={2.2} />
      </button>
    </div>
  )
}

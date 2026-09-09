import city from '../assets/sky/sky-day.webp'
import { useSkyPeriod } from '../hooks/useSkyPeriod'

export default function SkyHero() {
  const sky = useSkyPeriod()

  return (
    <section
      className={`sky-hero sky-hero--${sky.period}`}
      style={{
        '--sky-stars': sky.stars,
      }}
      aria-label="MixSell"
    >
      <img
        src={city}
        alt=""
        className="sky-hero-photo"
        width={3840}
        height={640}
        fetchPriority="high"
      />
      <div className="sky-hero-tint" aria-hidden="true" />
      <div className="sky-hero-stars" aria-hidden="true" />
      <div className="sky-hero-veil" />
      <div className="sky-hero-copy">
        <p className="sky-hero-title">MixSell | Uy | Avto</p>
        <p className="sky-hero-sub">Orzuingizdagi uy yoki mashinani toping</p>
      </div>
    </section>
  )
}

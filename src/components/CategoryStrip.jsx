import { useState } from 'react'
import { Building2, Car, Home, MapPin, Newspaper } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import avtoCar from '../assets/categories/avto-car.png'
import mapPin from '../assets/categories/map-pin.png'
import newsStack from '../assets/categories/news-stack.png'
import newBuilding from '../assets/categories/new-building.png'
import secondaryHome from '../assets/categories/secondary-home.png'
import { useMapSearch } from '../context/MapSearchContext'
import MarketJournal from './MarketJournal'

const CATEGORIES = [
  {
    id: 'buildings',
    title: 'Yangi binolar',
    text: 'Turar-joy majmualari katalogi',
    icon: Building2,
    photo: newBuilding,
    photoKind: 'cutout',
  },
  {
    id: 'cars',
    title: "Avto e'lonlar",
    text: 'Yangi va ishlatilgan mashinalar katalogi',
    icon: Car,
    photo: avtoCar,
    photoKind: 'cutout',
  },
  {
    id: 'map',
    title: 'Xarita',
    text: 'Turar-joy majmualarini xaritadan toping',
    icon: MapPin,
    photo: mapPin,
    photoKind: 'cutout',
  },
  {
    id: 'apartments',
    title: 'Ikkilamchi xonadonlar',
    text: "Sizning orzuingizga mos xonadonlar",
    icon: Home,
    photo: secondaryHome,
    photoKind: 'cutout',
  },
  {
    id: 'journal',
    title: 'Yangiliklar',
    text: "Ko'chmas mulk bozorida yangilik va tahlillar",
    icon: Newspaper,
    photo: newsStack,
    photoKind: 'cutout',
  },
]

export default function CategoryStrip({ activeId, onSelect }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { mapSearchOpen, openMapSearch } = useMapSearch()
  const [journalOpen, setJournalOpen] = useState(false)

  const inferredActive = location.pathname.startsWith('/avto')
    ? 'cars'
    : mapSearchOpen
      ? 'map'
      : new URLSearchParams(location.search).get('cat')
  const currentActive = journalOpen ? 'journal' : (activeId ?? inferredActive)

  function handleSelect(id) {
    if (id === 'journal') {
      setJournalOpen(true)
      return
    }
    if (onSelect) {
      onSelect(id)
      return
    }
    if (id === 'cars') {
      navigate('/avto')
      return
    }
    navigate(`/?cat=${id}`)
    if (id === 'map') openMapSearch()
  }

  return (
    <>
      <section className="category-section" aria-labelledby="categories-title">
        <h2 id="categories-title">Kategoriyalar</h2>
        <div className="category-row">
          {CATEGORIES.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                className={`category-card category-card--${item.id}${currentActive === item.id ? ' is-on' : ''}`}
                onClick={() => handleSelect(item.id)}
                aria-pressed={currentActive === item.id}
              >
                <div className="category-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <span className="category-icon">
                  <Icon size={15} strokeWidth={2.2} />
                </span>
                {item.photo ? (
                  <img
                    className={`category-art ${item.photoKind === 'cutout' ? 'category-art--cutout' : 'category-art--photo'}`}
                    src={item.photo}
                    alt=""
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </section>
      {journalOpen ? <MarketJournal onClose={() => setJournalOpen(false)} /> : null}
    </>
  )
}

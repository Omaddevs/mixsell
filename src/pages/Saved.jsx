import { useMemo, useState } from 'react'
import { Bookmark, Menu } from 'lucide-react'
import CarCard from '../components/CarCard'
import CatalogCard from '../components/CatalogCard'
import CategoryStrip from '../components/CategoryStrip'
import Layout from '../components/Layout'
import { useEngagement } from '../context/EngagementContext'
import { useMobileMenu } from '../context/MobileMenuContext'
import { regularCars, vipCars } from '../data/cars'
import { homeListings, regularListings } from '../data/properties'

const TABS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'home', label: 'Uylar' },
  { id: 'car', label: 'Avto' },
]

function MenuToggle() {
  const { onOpenMenu } = useMobileMenu()
  return (
    <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
      <Menu size={18} />
    </button>
  )
}

function isCar(item) {
  return Boolean(item.make || item.mileage)
}

export default function Saved() {
  const { savedIds } = useEngagement()
  const [tab, setTab] = useState('all')

  const items = useMemo(() => {
    const catalog = [...homeListings, ...regularListings, ...vipCars, ...regularCars]
    const unique = []
    const seen = new Set()
    catalog.forEach((item) => {
      if (!savedIds.includes(item.id) || seen.has(item.id)) return
      seen.add(item.id)
      unique.push(item)
    })
    return unique
  }, [savedIds])

  const homes = items.filter((item) => !isCar(item))
  const cars = items.filter((item) => isCar(item))
  const visible = tab === 'home' ? homes : tab === 'car' ? cars : items

  return (
    <Layout variant="home">
      <main className="listings-page">
        <div className="listings-toolbar">
          <div className="listings-heading">
            <MenuToggle />
            <h1>
              <Bookmark size={22} strokeWidth={2.2} color="#1363d2" fill="#1363d2" />
              <span className="listings-count">Saqlangan e’lonlar</span>
              <span className="listings-place">{items.length} ta</span>
            </h1>
          </div>
        </div>

        <CategoryStrip />

        <section className="listings-feed" aria-labelledby="saved-title">
          <div className="listings-feed-head">
            <div>
              <p className="listings-feed-kicker">Sevimlilar</p>
              <h2 id="saved-title">Like va saqlanganlar</h2>
            </div>
            <div className="deal-tabs deal-tabs--two saved-tabs" role="tablist" aria-label="Saqlangan turi">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={`deal-tab${tab === item.id ? ' is-on' : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length ? (
            <div className="catalog-grid" aria-label="Saqlangan e’lonlar">
              {visible.map((item) =>
                isCar(item) ? <CarCard key={item.id} car={item} /> : <CatalogCard key={item.id} listing={item} />,
              )}
            </div>
          ) : (
            <p className="listings-empty">
              Hali saqlangan e’lon yo‘q. E’londagi yurak yoki saqlash tugmasini bosing.
            </p>
          )}
        </section>
      </main>
    </Layout>
  )
}

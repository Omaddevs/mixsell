import { useEffect, useMemo, useState } from 'react'
import { Car, Fuel, Menu, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import CarCard from '../components/CarCard'
import CategoryStrip from '../components/CategoryStrip'
import Dropdown from '../components/Dropdown'
import FiltersButton, { FilterGroup, FilterOption } from '../components/FiltersButton'
import Layout from '../components/Layout'
import Pagination, { useCatalogPageSize } from '../components/Pagination'
import { useMobileMenu } from '../context/MobileMenuContext'
import { CAR_KINDS, carMakes } from '../data/catalogMenus'
import { regularCars, vipCars } from '../data/cars'

const PRICE_OPTIONS = ['Har qanday narx', '$15k gacha', '$15k–$30k', '$30k+']
const SORT_OPTIONS = ['Standart bo‘yicha', 'Yangi', 'Avval arzon', 'Avval qimmat']
const DEAL_TABS = [
  { id: 'sale', label: 'Sotuv' },
  { id: 'rent', label: 'Ijara' },
]
const CAR_TYPES = [
  { id: 'all', label: 'Barcha turlar' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'electro', label: 'Elektro' },
  { id: 'minivan', label: 'Miniven' },
]
const FUEL_OPTIONS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'benzin', label: 'Benzin' },
  { id: 'gaz', label: 'Gaz' },
  { id: 'dizel', label: 'Dizel' },
  { id: 'elektro', label: 'Elektro' },
]
const GEAR_OPTIONS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'avtomat', label: 'Avtomat' },
  { id: 'mexanika', label: 'Mexanika' },
]

function matchesPrice(car, price) {
  if (car.deal !== 'sale') return true
  if (price === '$15k gacha') return car.price < 15000
  if (price === '$15k–$30k') return car.price >= 15000 && car.price <= 30000
  if (price === '$30k+') return car.price > 30000
  return true
}

function sortCars(list, sort) {
  const next = [...list]
  if (sort === 'Yangi') next.sort((a, b) => b.createdAt - a.createdAt)
  else if (sort === 'Avval arzon') next.sort((a, b) => a.price - b.price)
  else if (sort === 'Avval qimmat') next.sort((a, b) => b.price - a.price)
  else next.sort((a, b) => Number(b.vip || b.isTop) - Number(a.vip || a.isTop) || b.createdAt - a.createdAt)
  return next
}

function matchesCar(car, { query, deal, type, price, fuel, gear, make, kind }) {
  const q = query.trim().toLowerCase()
  const text = `${car.title} ${car.make} ${car.model} ${car.city}`.toLowerCase()
  const kindDeal =
    kind === 'all'
      ? true
      : kind === 'sale' || kind === 'rent'
        ? car.deal === kind
        : kind === 'models'
          ? true
          : car.deal === deal
  return (
    (!q || text.includes(q)) &&
    kindDeal &&
    (type === 'all' || car.type === type) &&
    (fuel === 'all' || car.fuel === fuel) &&
    (gear === 'all' || car.transmission === gear) &&
    (!make || car.make === make) &&
    matchesPrice(car, price)
  )
}

function MenuToggle() {
  const { onOpenMenu } = useMobileMenu()
  return (
    <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
      <Menu size={18} />
    </button>
  )
}

export default function Cars() {
  const [searchParams] = useSearchParams()
  const kind = searchParams.get('kind')
  const kindMeta = CAR_KINDS.find((item) => item.id === kind)
  const makes = useMemo(() => carMakes(), [])
  const [query, setQuery] = useState('')
  const [deal, setDeal] = useState('sale')
  const [type, setType] = useState('all')
  const [make, setMake] = useState('')
  const [price, setPrice] = useState('Har qanday narx')
  const [sort, setSort] = useState('Standart bo‘yicha')
  const [fuel, setFuel] = useState('all')
  const [gear, setGear] = useState('all')
  const [catalogPage, setCatalogPage] = useState(1)
  const catalogPageSize = useCatalogPageSize()

  const visibleVip = useMemo(
    () => sortCars(vipCars.filter((car) => matchesCar(car, { query, deal, type, price, fuel, gear, make, kind })), sort),
    [query, deal, type, price, fuel, gear, make, kind, sort],
  )
  const visibleRegular = useMemo(
    () => sortCars(regularCars.filter((car) => matchesCar(car, { query, deal, type, price, fuel, gear, make, kind })), sort),
    [query, deal, type, price, fuel, gear, make, kind, sort],
  )

  const catalogPageCount = Math.max(1, Math.ceil(visibleRegular.length / catalogPageSize))
  const pagedRegular = useMemo(() => {
    const start = (catalogPage - 1) * catalogPageSize
    return visibleRegular.slice(start, start + catalogPageSize)
  }, [visibleRegular, catalogPage, catalogPageSize])

  useEffect(() => {
    setCatalogPage(1)
  }, [query, deal, type, price, fuel, gear, sort, catalogPageSize, make, kind])

  useEffect(() => {
    if (kind === 'all') {
      setMake('')
      return
    }
    if (kind === 'sale' || kind === 'rent') {
      setDeal(kind)
      setMake('')
    }
    if (kind === 'models') setDeal('sale')
  }, [kind])

  useEffect(() => {
    if (catalogPage > catalogPageCount) setCatalogPage(catalogPageCount)
  }, [catalogPage, catalogPageCount])

  function goCatalogPage(page) {
    setCatalogPage(page)
    document.getElementById('catalog-block')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filterCount =
    (price !== 'Har qanday narx' ? 1 : 0) +
    (type !== 'all' ? 1 : 0) +
    (fuel !== 'all' ? 1 : 0) +
    (gear !== 'all' ? 1 : 0)

  function resetFilters() {
    setPrice('Har qanday narx')
    setType('all')
    setFuel('all')
    setGear('all')
  }

  return (
    <Layout variant="home">
      <main className="listings-page">
          <div className="listings-toolbar">
            <div className="listings-heading">
              <MenuToggle />
              <h1>
                <Car size={22} strokeWidth={2.2} color="#1363d2" />
                <span className="listings-count">{kindMeta ? kindMeta.label : 'Avto savdosi'}</span>
                <span className="listings-place">{visibleVip.length + visibleRegular.length} ta mashina</span>
              </h1>
            </div>

            <div className="listings-controls">
              <label className="listings-search">
                <Search size={16} strokeWidth={1.8} />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Marka, model yoki shahar..."
                  aria-label="Mashina qidirish"
                />
              </label>
              <FiltersButton count={filterCount} onReset={resetFilters}>
                <FilterGroup title="Narx">
                  {PRICE_OPTIONS.map((item) => (
                    <FilterOption key={item} selected={price === item} onClick={() => setPrice(item)}>
                      {item}
                    </FilterOption>
                  ))}
                </FilterGroup>
                <FilterGroup title="Mashina turi">
                  {CAR_TYPES.map((item) => (
                    <FilterOption key={item.id} selected={type === item.id} onClick={() => setType(item.id)}>
                      {item.label}
                    </FilterOption>
                  ))}
                </FilterGroup>
                <FilterGroup title="Yoqilg‘i">
                  {FUEL_OPTIONS.map((item) => (
                    <FilterOption key={item.id} selected={fuel === item.id} onClick={() => setFuel(item.id)}>
                      {item.label}
                    </FilterOption>
                  ))}
                </FilterGroup>
                <FilterGroup title="Uzatma">
                  {GEAR_OPTIONS.map((item) => (
                    <FilterOption key={item.id} selected={gear === item.id} onClick={() => setGear(item.id)}>
                      {item.label}
                    </FilterOption>
                  ))}
                </FilterGroup>
              </FiltersButton>
              <div className="listings-sort">
                <span>Saralash:</span>
                <Dropdown value={sort} options={SORT_OPTIONS} onChange={setSort} ariaLabel="Saralash" />
              </div>
            </div>
          </div>

          <CategoryStrip />

          {kind === 'models' ? (
            <section className="car-models" aria-label="Avto modellari">
              {makes.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={make === item.name ? 'is-on' : undefined}
                  onClick={() => setMake((current) => (current === item.name ? '' : item.name))}
                >
                  <img src={item.image} alt="" />
                  <strong>{item.name}</strong>
                  <em>{item.count} ta e’lon</em>
                </button>
              ))}
            </section>
          ) : null}

          <section className="listings-feed" aria-labelledby="cars-feed-title">
            <div className="listings-feed-head">
              <div>
                <p className="listings-feed-kicker">VIP</p>
                <h2 id="cars-feed-title">
                  {kind === 'models' ? 'Modellar' : kind === 'rent' ? 'Arenda avtolar' : kind === 'sale' ? 'Sotuvdagi Avtolar' : 'Vip avto'}
                </h2>
              </div>
              <p className="listings-feed-count">{visibleVip.length} ta mashina</p>
            </div>

            <div className="market-filters">
              <div className="deal-tabs-row">
                <div className="deal-tabs deal-tabs--two" role="tablist" aria-label="E’lon turi">
                  {DEAL_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={deal === tab.id}
                      className={`deal-tab${deal === tab.id ? ' is-on' : ''}`}
                      onClick={() => setDeal(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-chips">
                {CAR_TYPES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`filter-chip${type === item.id ? ' is-on' : ''}`}
                    onClick={() => setType(item.id)}
                  >
                    {item.id === 'electro' ? <Fuel size={16} strokeWidth={2} /> : null}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {visibleVip.length ? (
              <div className="vip-carousel-track cars-vip-track" aria-label="VIP avto">
                {visibleVip.map((car) => (
                  <CarCard key={car.id} car={car} compact />
                ))}
              </div>
            ) : (
              <p className="listings-empty">Bu filterlarga mos VIP avto yo‘q.</p>
            )}
          </section>

          <section className="listings-feed" id="catalog-block" aria-labelledby="all-cars-title">
            <div className="listings-feed-head">
              <div>
                <p className="listings-feed-kicker">Katalog</p>
                <h2 id="all-cars-title">{kind === 'models' ? 'Modellar' : kind === 'rent' ? 'Arenda avtolar' : kind === 'sale' ? 'Sotuvdagi Avtolar' : 'Barcha E’lonlar'}</h2>
              </div>
              <p className="listings-feed-count">{visibleRegular.length} ta mashina</p>
            </div>
            {visibleRegular.length ? (
              <>
                <p className="catalog-total">Sahifa {catalogPage} / {catalogPageCount}</p>
                <div className="catalog-grid" aria-label="Barcha avto e’lonlari">
                  {pagedRegular.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                <Pagination page={catalogPage} pageCount={catalogPageCount} onChange={goCatalogPage} />
              </>
            ) : (
              <p className="listings-empty">Bu filterlarga mos mashina topilmadi.</p>
            )}
          </section>
        </main>
    </Layout>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CatalogCard from '../components/CatalogCard'
import CategoryStrip from '../components/CategoryStrip'
import Dropdown from '../components/Dropdown'
import { FilterGroup, FilterOption } from '../components/FiltersButton'
import Layout from '../components/Layout'
import ListingsMap from '../components/ListingsMap'
import ListingsToolbar from '../components/ListingsToolbar'
import MapSearch from '../components/MapSearch'
import MarketFilters, { PROPERTY_TYPES } from '../components/MarketFilters'
import MortgageCalculator from '../components/MortgageCalculator'
import MapFeedCard from '../components/MapFeedCard'
import Pagination, { useCatalogPageSize } from '../components/Pagination'
import Toggle from '../components/Toggle'
import VipCarousel from '../components/VipCarousel'
import { useMapSearch } from '../context/MapSearchContext'
import { homeListings, regularListings } from '../data/properties'
import { HOME_KINDS, matchesHomeKind } from '../data/catalogMenus'

function matchesPrice(listing, price) {
  if (listing.deal !== 'sale') return true
  if (price === 'Under $150k') return listing.price < 150000
  if (price === '$150k–$200k') return listing.price >= 150000 && listing.price <= 200000
  if (price === '$200k+') return listing.price > 200000
  return true
}

function matchesBeds(listing, beds) {
  if (beds === '1+ Beds') return listing.beds >= 1
  if (beds === '2-4 Beds') return listing.beds >= 2 && listing.beds <= 4
  if (beds === '5+ Beds') return listing.beds >= 5
  return true
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const MONTH_MS = 30 * 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-09-08T14:00:00')

function matchesPeriod(listing, period) {
  if (period === 'week') return NOW - listing.createdAt <= WEEK_MS
  if (period === 'month') return NOW - listing.createdAt <= MONTH_MS
  return true
}

function sortListings(list, sort) {
  const next = [...list]
  if (sort === 'Price: Low to High') next.sort((a, b) => a.price - b.price)
  else if (sort === 'Price: High to Low') next.sort((a, b) => b.price - a.price)
  else if (sort === 'Largest') next.sort((a, b) => b.sqft - a.sqft)
  else next.sort((a, b) => b.createdAt - a.createdAt)
  return next
}

const CATALOG_SORTS = ['Standart bo‘yicha', 'Yangi', 'Avval arzon', 'Avval qimmat']
const PRICE_OPTIONS = ['Any Price', 'Under $150k', '$150k–$200k', '$200k+']
const BED_OPTIONS = ['Any Beds', '1+ Beds', '2-4 Beds', '5+ Beds']

function sortCatalog(list, sort) {
  const next = [...list]
  if (sort === 'Yangi') next.sort((a, b) => b.createdAt - a.createdAt)
  else if (sort === 'Avval arzon') next.sort((a, b) => a.price - b.price)
  else if (sort === 'Avval qimmat') next.sort((a, b) => b.price - a.price)
  else next.sort((a, b) => Number(b.isTop) - Number(a.isTop) || b.createdAt - a.createdAt)
  return next
}

function matchesListing(item, { query, price, beds, familyMode, deal, category, ownerOnly, mortgageOnly, period, kind }) {
  const q = query.trim().toLowerCase()
  const text = `${item.street} ${item.city} ${item.title ?? ''}`.toLowerCase()
  const matchesQuery = !q || text.includes(q)
  const matchesKind = matchesHomeKind(item, kind)
  const allKinds = !kind || kind === 'all'
  const matchesCategory = !allKinds || category === 'all' ? true : item.category === category
  const matchesDeal = !allKinds || kind === 'all' ? true : item.deal === deal
  const matchesOwner = !ownerOnly || item.owner
  const matchesMortgage = !mortgageOnly || item.mortgage
  const matchesFamily = !familyMode || item.beds >= 3
  return (
    matchesQuery &&
    matchesPrice(item, price) &&
    matchesBeds(item, beds) &&
    matchesKind &&
    matchesCategory &&
    matchesDeal &&
    matchesOwner &&
    matchesMortgage &&
    matchesPeriod(item, period) &&
    matchesFamily
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [price, setPrice] = useState('Any Price')
  const [beds, setBeds] = useState('2-4 Beds')
  const [deal, setDeal] = useState('sale')
  const [category, setCategory] = useState('all')
  const [ownerOnly, setOwnerOnly] = useState(false)
  const [mortgageOnly, setMortgageOnly] = useState(false)
  const [period, setPeriod] = useState('any')
  const [sort, setSort] = useState('Newest')
  const [catalogSort, setCatalogSort] = useState('Standart bo‘yicha')
  const [catalogPage, setCatalogPage] = useState(1)
  const catalogPageSize = useCatalogPageSize()
  const [familyMode, setFamilyMode] = useState(true)
  const [mapView, setMapView] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [focusNonce, setFocusNonce] = useState(0)
  const [modal, setModal] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchParams] = useSearchParams()
  const { mapSearchOpen, openMapSearch, closeMapSearch } = useMapSearch()
  const incomingCategory = searchParams.get('cat')
  const kind = searchParams.get('kind')
  const kindMeta = HOME_KINDS.find((item) => item.id === kind)

  function selectListing(id) {
    setSelectedId(id)
    setFocusNonce((value) => value + 1)
  }

  function handleCategory(id) {
    if (id === 'cars') {
      navigate('/avto')
      return
    }
    setActiveCategory(id)
    if (id === 'buildings') {
      setCategory('house')
      setDeal('sale')
      setFamilyMode(true)
      setBeds('2-4 Beds')
    } else if (id === 'apartments') {
      setCategory('apartment')
      setDeal('sale')
      setFamilyMode(false)
      setBeds('Any Beds')
    } else if (id === 'map') {
      setMapView(true)
      openMapSearch()
    }
  }

  useEffect(() => {
    if (incomingCategory === 'buildings' || incomingCategory === 'apartments' || incomingCategory === 'map') {
      handleCategory(incomingCategory)
    }
  }, [incomingCategory])

  useEffect(() => {
    if (!kind) return
    setFamilyMode(false)
    setBeds('Any Beds')
    setActiveCategory(null)
    if (kind === 'all') {
      setCategory('all')
      return
    }
    if (kind === 'ijara') {
      setDeal('rent')
      setCategory('all')
    } else if (kind === 'hovli') {
      setDeal('sale')
      setCategory('house')
    } else if (kind === 'kvartira') {
      setDeal('sale')
      setCategory('apartment')
    } else if (kind === 'dacha') {
      setDeal('sale')
      setCategory('dacha')
    } else if (kind === 'mehmonxona') {
      setDeal('daily')
      setCategory('hotel')
    } else if (kind === 'yer') {
      setDeal('sale')
      setCategory('land')
    }
  }, [kind])

  const visible = useMemo(
    () =>
      sortListings(
        homeListings.filter((item) =>
          matchesListing(item, { query, price, beds, familyMode, deal, category, ownerOnly, mortgageOnly, period, kind }),
        ),
        sort,
      ),
    [query, price, beds, sort, familyMode, deal, category, ownerOnly, mortgageOnly, period, kind],
  )

  const visibleRegular = useMemo(
    () =>
      sortCatalog(
        regularListings.filter((item) =>
          matchesListing(item, { query, price, beds, familyMode, deal, category, ownerOnly, mortgageOnly, period, kind }),
        ),
        catalogSort,
      ),
    [query, price, beds, catalogSort, familyMode, deal, category, ownerOnly, mortgageOnly, period, kind],
  )

  const catalogPageCount = Math.max(1, Math.ceil(visibleRegular.length / catalogPageSize))
  const pagedRegular = useMemo(() => {
    const start = (catalogPage - 1) * catalogPageSize
    return visibleRegular.slice(start, start + catalogPageSize)
  }, [visibleRegular, catalogPage, catalogPageSize])

  useEffect(() => {
    setCatalogPage(1)
  }, [query, price, beds, catalogSort, familyMode, deal, category, ownerOnly, mortgageOnly, period, catalogPageSize, kind])

  useEffect(() => {
    if (catalogPage > catalogPageCount) setCatalogPage(catalogPageCount)
  }, [catalogPage, catalogPageCount])

  function goCatalogPage(page) {
    setCatalogPage(page)
    document.getElementById('catalog-block')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const mapSearchListings = useMemo(
    () => [...visible.map((item) => ({ ...item, vip: true })), ...visibleRegular],
    [visible, visibleRegular],
  )

  const mapFeedListings = useMemo(() => {
    const seen = new Set()
    return mapSearchListings.filter((item) => {
      if (seen.has(item.id) || !Number.isFinite(item.lat) || !Number.isFinite(item.lng)) return false
      seen.add(item.id)
      return true
    })
  }, [mapSearchListings])

  const filtersDirty =
    query.trim() !== '' ||
    price !== 'Any Price' ||
    beds !== '2-4 Beds' ||
    deal !== 'sale' ||
    category !== 'all' ||
    ownerOnly ||
    mortgageOnly ||
    period !== 'any' ||
    !familyMode

  const filterCount =
    (price !== 'Any Price' ? 1 : 0) +
    (beds !== '2-4 Beds' ? 1 : 0) +
    (category !== 'all' ? 1 : 0) +
    (ownerOnly ? 1 : 0) +
    (mortgageOnly ? 1 : 0) +
    (period !== 'any' ? 1 : 0) +
    (familyMode ? 0 : 1)

  function resetSheetFilters() {
    setPrice('Any Price')
    setBeds('2-4 Beds')
    setCategory('all')
    setOwnerOnly(false)
    setMortgageOnly(false)
    setPeriod('any')
    setFamilyMode(true)
    setActiveCategory(null)
  }

  function clearFilters() {
    setQuery('')
    setPrice('Any Price')
    setBeds('2-4 Beds')
    setDeal('sale')
    setCategory('all')
    setOwnerOnly(false)
    setMortgageOnly(false)
    setPeriod('any')
    setFamilyMode(true)
    setCatalogSort('Standart bo‘yicha')
    setActiveCategory(null)
  }

  useEffect(() => {
    if (selectedId && !visible.some((item) => item.id === selectedId)) setSelectedId(null)
  }, [visible, selectedId])

  useEffect(() => {
    if (!mapView || !selectedId) return
    document.querySelector(`.map-feed [data-listing-id="${selectedId}"]`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [selectedId, mapView])

  useEffect(() => {
    if (category !== 'house' && activeCategory === 'buildings') setActiveCategory(mapView ? 'map' : null)
    if (category !== 'apartment' && activeCategory === 'apartments') setActiveCategory(mapView ? 'map' : null)
  }, [category, activeCategory, mapView])

  useEffect(() => {
    if (!modal) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setModal(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modal])

  return (
    <Layout variant="home">
      <main className="listings-page">
        <ListingsToolbar
          resultCount={visible.length + visibleRegular.length}
          locationLabel="New York, US"
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          mapView={mapView}
          onMapViewChange={(value) => {
            setMapView(value)
            if (!value && activeCategory === 'map') setActiveCategory(null)
          }}
          filterCount={filterCount}
          onResetFilters={resetSheetFilters}
        >
          <FilterGroup title="Narx">
            {PRICE_OPTIONS.map((item) => (
              <FilterOption key={item} selected={price === item} onClick={() => setPrice(item)}>
                {item === 'Any Price' ? 'Har qanday' : item}
              </FilterOption>
            ))}
          </FilterGroup>
          <FilterGroup title="Xonalar">
            {BED_OPTIONS.map((item) => (
              <FilterOption key={item} selected={beds === item} onClick={() => setBeds(item)}>
                {item === 'Any Beds' ? 'Har qanday' : item}
              </FilterOption>
            ))}
          </FilterGroup>
          <FilterGroup title="Ko‘chmas mulk turi">
            {PROPERTY_TYPES.map((item) => (
              <FilterOption key={item.id} selected={category === item.id} onClick={() => setCategory(item.id)}>
                {item.label}
              </FilterOption>
            ))}
          </FilterGroup>
          <FilterGroup title="Qo‘shimcha">
            <FilterOption selected={ownerOnly} onClick={() => setOwnerOnly((value) => !value)}>
              Egasi
            </FilterOption>
            <FilterOption selected={mortgageOnly} onClick={() => setMortgageOnly((value) => !value)}>
              Ipotekaga mumkin
            </FilterOption>
            <FilterOption selected={period === 'week'} onClick={() => setPeriod(period === 'week' ? 'any' : 'week')}>
              Oxirgi hafta
            </FilterOption>
            <FilterOption selected={period === 'month'} onClick={() => setPeriod(period === 'month' ? 'any' : 'month')}>
              Oxirgi oy
            </FilterOption>
          </FilterGroup>
          <div className="filter-toggle-row">
            <Toggle checked={familyMode} onChange={setFamilyMode} label="Oilaviy rejim" />
            <p className="filter-toggle-note">3 va undan ko‘p xonali uylar</p>
          </div>
        </ListingsToolbar>

        <CategoryStrip activeId={activeCategory} onSelect={handleCategory} />

        <section className="listings-feed" aria-labelledby="listings-feed-title">
          <div className="listings-feed-head">
            <div>
              <p className="listings-feed-kicker">VIP</p>
              <h2 id="listings-feed-title">{!kind || kind === 'all' ? 'Vip Elonlar' : kindMeta.label}</h2>
            </div>
            <p className="listings-feed-count">{visible.length} ta e’lon</p>
          </div>

          <MarketFilters
            deal={deal}
            onDealChange={setDeal}
            category={category}
            onCategoryChange={setCategory}
            ownerOnly={ownerOnly}
            onOwnerOnlyChange={setOwnerOnly}
            mortgageOnly={mortgageOnly}
            onMortgageOnlyChange={setMortgageOnly}
            period={period}
            onPeriodChange={setPeriod}
            onOpenMapSearch={openMapSearch}
          />

          <div className={`listings-body${mapView ? ' is-map' : ''}`}>
            {mapView ? (
              <div className="map-feed" aria-label="Xaritadagi e’lonlar">
                {mapFeedListings.length ? (
                  mapFeedListings.map((listing) => (
                    <MapFeedCard
                      key={listing.id}
                      listing={listing}
                      selected={listing.id === selectedId}
                      onSelect={() => selectListing(listing.id)}
                    />
                  ))
                ) : (
                  <p className="listings-empty">Bu filterlarga mos e’lon topilmadi.</p>
                )}
              </div>
            ) : (
              <VipCarousel listings={visible} selectedId={selectedId} />
            )}

            {mapView ? (
              <ListingsMap
                listings={mapFeedListings}
                selectedId={selectedId}
                focusNonce={focusNonce}
                onSelect={selectListing}
              />
            ) : null}
          </div>

        </section>

        {mapView ? null : (
          <section className="listings-feed" id="catalog-block" aria-labelledby="all-ads-title">
            <div className="listings-feed-head">
              <div>
                <p className="listings-feed-kicker">Katalog</p>
                <h2 id="all-ads-title">{!kind || kind === 'all' ? 'Barcha E’lonlar' : kindMeta.label}</h2>
              </div>
              <p className="listings-feed-count">{visibleRegular.length} ta e’lon</p>
            </div>

            <div className="catalog-head">
              <p className="catalog-total">
                Jami: {regularListings.length.toLocaleString('en-US')}
                {visibleRegular.length ? ` · Sahifa ${catalogPage} / ${catalogPageCount}` : null}
                {filtersDirty ? (
                  <button type="button" className="clear-filters" onClick={clearFilters}>
                    × Tozalash
                  </button>
                ) : null}
              </p>
              <div className="catalog-sort-wrap">
                <span>Saralash:</span>
                <Dropdown
                  value={catalogSort}
                  options={CATALOG_SORTS}
                  onChange={setCatalogSort}
                  ariaLabel="Saralash"
                />
              </div>
            </div>

            {visibleRegular.length ? (
              <>
                <div className="catalog-grid" aria-label="Barcha e’lonlar">
                  {pagedRegular.map((listing) => (
                    <CatalogCard key={listing.id} listing={listing} />
                  ))}
                </div>
                <Pagination page={catalogPage} pageCount={catalogPageCount} onChange={goCatalogPage} />
              </>
            ) : (
              <p className="listings-empty">Bu filterlarga mos e’lon topilmadi.</p>
            )}
          </section>
        )}

        {modal === 'calculator' ? <MortgageCalculator onClose={() => setModal(null)} /> : null}
        {mapSearchOpen ? (
          <MapSearch listings={mapSearchListings} onClose={closeMapSearch} />
        ) : null}
      </main>
    </Layout>
  )
}

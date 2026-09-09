import { Info, Menu, Search } from 'lucide-react'
import Dropdown from './Dropdown'
import FiltersButton from './FiltersButton'
import Toggle from './Toggle'
import { useMobileMenu } from '../context/MobileMenuContext'

const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Largest']

export default function ListingsToolbar({
  resultCount,
  locationLabel,
  query,
  onQueryChange,
  sort,
  onSortChange,
  mapView,
  onMapViewChange,
  filterCount = 0,
  onResetFilters,
  children,
}) {
  const { onOpenMenu } = useMobileMenu()

  return (
    <div className="listings-toolbar">
      <div className="listings-heading">
        <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
          <Menu size={18} />
        </button>
        <h1>
          <span className="listings-count">{resultCount} Results</span>
          <span className="listings-place">in {locationLabel}</span>
        </h1>
      </div>

      <div className="listings-controls">
        <label className="listings-search">
          <Search size={16} strokeWidth={1.8} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by location..."
            aria-label="Search by location"
          />
        </label>

        <FiltersButton count={filterCount} onReset={onResetFilters}>
          {children}
        </FiltersButton>

        <Toggle checked={mapView} onChange={onMapViewChange} label="Map View" />
        <span className="toggle-info" title="Show listings on the map">
          <Info size={14} />
        </span>

        <div className="listings-sort">
          <span>Sort by:</span>
          <Dropdown value={sort} options={SORT_OPTIONS} onChange={onSortChange} ariaLabel="Sort listings" />
        </div>
      </div>
    </div>
  )
}

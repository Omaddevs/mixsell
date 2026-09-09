import { Search, SlidersHorizontal } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
  filterOpen,
  onToggleFilter,
  filters,
  onFilterChange,
}) {
  return (
    <div>
      <div className="search-bar">
        <Search size={16} color="#8a94a1" strokeWidth={1.8} aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search Property"
          aria-label="Search Property"
        />
        <button
          type="button"
          className={`search-filter${filterOpen ? ' is-open' : ''}`}
          aria-label="Filter listings"
          aria-expanded={filterOpen}
          onClick={onToggleFilter}
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
      {filterOpen ? (
        <div className="filter-panel">
          <label>
            Property type
            <select
              value={filters.type}
              onChange={(event) => onFilterChange({ ...filters, type: event.target.value })}
            >
              <option value="all">All types</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
            </select>
          </label>
          <label>
            Minimum beds
            <select
              value={filters.beds}
              onChange={(event) => onFilterChange({ ...filters, beds: Number(event.target.value) })}
            >
              <option value="0">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>
        </div>
      ) : null}
    </div>
  )
}

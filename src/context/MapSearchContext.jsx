import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const MapSearchContext = createContext({
  mapSearchOpen: false,
  openMapSearch: () => {},
  closeMapSearch: () => {},
})

export function MapSearchProvider({ children }) {
  const [mapSearchOpen, setMapSearchOpen] = useState(false)
  const openMapSearch = useCallback(() => setMapSearchOpen(true), [])
  const closeMapSearch = useCallback(() => setMapSearchOpen(false), [])
  const value = useMemo(
    () => ({ mapSearchOpen, openMapSearch, closeMapSearch }),
    [mapSearchOpen, openMapSearch, closeMapSearch],
  )

  return <MapSearchContext.Provider value={value}>{children}</MapSearchContext.Provider>
}

export function useMapSearch() {
  return useContext(MapSearchContext)
}

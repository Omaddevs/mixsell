import { createContext, useContext } from 'react'

export const MobileMenuContext = createContext({
  onOpenMenu: () => {},
  onCloseMenu: () => {},
  mobileOpen: false,
})

export function useMobileMenu() {
  return useContext(MobileMenuContext)
}

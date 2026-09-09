import { useState } from 'react'
import { MobileMenuContext } from '../context/MobileMenuContext'
import Sidebar from './Sidebar'
import SkyHero from './SkyHero'
import TopBar from './TopBar'
import MobileTabBar from './MobileTabBar'

export default function Layout({ variant = 'dashboard', hero = true, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <MobileMenuContext.Provider
      value={{
        mobileOpen,
        onOpenMenu: () => setMobileOpen(true),
        onCloseMenu: () => setMobileOpen(false),
      }}
    >
      <div className={`page page--${variant}`}>
        {mobileOpen ? (
          <button
            type="button"
            className="drawer-backdrop"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
        <div className={`app-shell app-shell--${variant}`}>
          <Sidebar />
          {variant === 'home' ? <TopBar /> : null}
          {hero ? <SkyHero /> : null}
          {children}
        </div>
        <MobileTabBar />
      </div>
    </MobileMenuContext.Provider>
  )
}

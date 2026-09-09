import { useLayoutEffect, useRef, useState } from 'react'
import { Car, Home, MessageSquare, User } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { messages } from '../data/dashboard'

const TABS = [
  { to: '/', icon: Home, label: 'Uy', end: true },
  { to: '/avto', icon: Car, label: 'Avto' },
  { to: '/habarlar', icon: MessageSquare, label: 'Xabar', notify: true },
  { to: '/profil', icon: User, label: 'Profil', match: ['/profil', '/sozlamalar'] },
]

function isTabActive(tab, pathname) {
  if (tab.match?.some((path) => pathname.startsWith(path))) return true
  if (tab.end) return pathname === tab.to
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`)
}

export default function MobileTabBar() {
  const hasUnread = messages.some((item) => item.unread)
  const location = useLocation()
  const navRef = useRef(null)
  const itemRefs = useRef({})
  const mountedRef = useRef(false)
  const [indicator, setIndicator] = useState(null)
  const [morphTick, setMorphTick] = useState(0)

  const activeIndex = TABS.findIndex((tab) => isTabActive(tab, location.pathname))

  useLayoutEffect(() => {
    const activeTab = TABS[activeIndex] ?? TABS[0]
    const el = itemRefs.current[activeTab.to]
    const nav = navRef.current
    if (!el || !nav) return

    const measure = () => {
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({ x: elRect.left - navRect.left, w: elRect.width })
    }

    measure()
    if (mountedRef.current) {
      setMorphTick((tick) => tick + 1)
    }
    mountedRef.current = true

    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIndex])

  return (
    <nav ref={navRef} className="mobile-tabbar" aria-label="Mobil menyu">
      {indicator ? (
        <div
          className="mobile-tabbar-indicator"
          style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
        >
          <span key={morphTick} className="mobile-tabbar-indicator-blob" />
        </div>
      ) : null}
      {TABS.map((tab) => (
        <TabLink
          key={tab.to}
          tab={tab}
          notify={tab.notify && hasUnread}
          isActive={isTabActive(tab, location.pathname)}
          setRef={(el) => {
            itemRefs.current[tab.to] = el
          }}
        />
      ))}
    </nav>
  )
}

function TabLink({ tab, notify, isActive, setRef }) {
  const Icon = tab.icon

  return (
    <NavLink
      ref={setRef}
      to={tab.to}
      end={tab.end}
      aria-label={tab.label}
      className={`mobile-tabbar-item${isActive ? ' is-on' : ''}`}
    >
      <span className="mobile-tabbar-ico">
        <Icon size={22} strokeWidth={1.85} />
        {notify ? <span className="mobile-tabbar-dot" /> : null}
      </span>
    </NavLink>
  )
}

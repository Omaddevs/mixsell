import { useLayoutEffect, useRef, useState } from 'react'
import { Heart, Home, Map, MessageCircle, Plus } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { messages } from '../data/dashboard'
import { useMapSearch } from '../context/MapSearchContext'
import { useProfile } from '../context/ProfileContext'

const TABS = [
  { to: '/', icon: Home, label: 'Asosiy', end: true },
  { to: '/saqlangan', icon: Heart, label: 'Sevimli' },
  { to: '/elon-qoshish', icon: Plus, label: "E'lon", fab: true },
  { to: '/habarlar', icon: MessageCircle, label: 'Xabar', notify: true },
  { to: '/profil', icon: 'avatar', label: 'Profil', match: ['/profil', '/sozlamalar'] },
]

function isTabActive(tab, pathname) {
  if (tab.match?.some((path) => pathname.startsWith(path))) return true
  if (tab.end) return pathname === tab.to
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`)
}

export default function MobileTabBar() {
  const hasUnread = messages.some((item) => item.unread)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { openMapSearch, mapSearchOpen } = useMapSearch()
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

  const handleMapTap = () => {
    if (location.pathname !== '/') navigate('/')
    openMapSearch()
  }

  if (mapSearchOpen) return null

  return (
    <div className="mobile-tabbar-dock">
      <button type="button" className="mobile-tabbar-mapbtn" onClick={handleMapTap} aria-label="Xaritada ko'rish">
        <Map size={16} strokeWidth={2} />
        Xarita
      </button>

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
            avatar={tab.icon === 'avatar' ? profile.avatar : null}
            setRef={(el) => {
              itemRefs.current[tab.to] = el
            }}
          />
        ))}
      </nav>
    </div>
  )
}

function TabLink({ tab, notify, isActive, avatar, setRef }) {
  const Icon = tab.icon !== 'avatar' ? tab.icon : null

  if (tab.fab) {
    return (
      <NavLink
        ref={setRef}
        to={tab.to}
        end={tab.end}
        aria-label={tab.label}
        className={`mobile-tabbar-item mobile-tabbar-item--fab${isActive ? ' is-on' : ''}`}
      >
        <span className="mobile-tabbar-fab">
          <Icon size={22} strokeWidth={2.4} />
        </span>
        <span className="mobile-tabbar-label">{tab.label}</span>
      </NavLink>
    )
  }

  return (
    <NavLink
      ref={setRef}
      to={tab.to}
      end={tab.end}
      aria-label={tab.label}
      className={`mobile-tabbar-item${isActive ? ' is-on' : ''}`}
    >
      <span className="mobile-tabbar-ico">
        {avatar ? (
          <img className="mobile-tabbar-avatar" src={avatar} alt="" />
        ) : (
          <Icon size={22} strokeWidth={isActive ? 2.3 : 1.85} />
        )}
        {notify ? <span className="mobile-tabbar-dot" /> : null}
      </span>
      <span className="mobile-tabbar-label">{tab.label}</span>
    </NavLink>
  )
}

import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  Bookmark,
  Building2,
  CalendarClock,
  Car,
  Check,
  ChevronsUpDown,
  CircleHelp,
  GripVertical,
  Home,
  Hotel,
  KeyRound,
  Layers,
  LayoutGrid,
  LogOut,
  Map,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings as SettingsIcon,
  Star,
  Trees,
  User,
} from 'lucide-react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { messages, notifications, sidebarPrimary } from '../data/dashboard'
import { useMapSearch } from '../context/MapSearchContext'
import { useMobileMenu } from '../context/MobileMenuContext'
import { useProfile } from '../context/ProfileContext'
import { useClickOutside } from '../hooks/useClickOutside'
import logo from '../assets/logo.png'
import {
  CAR_KINDS,
  HOME_KINDS,
  carKindCount,
  formatCount,
  homeKindCount,
} from '../data/catalogMenus'

const STORAGE_KEY = 'mixsell-sidebar-collapsed'

const NAV_ICONS = {
  home: Home,
  cars: Car,
  saved: Bookmark,
  messages: MessageSquare,
  notifications: Bell,
}

const KIND_ICONS = {
  all: Layers,
  ijara: KeyRound,
  hovli: Home,
  kvartira: Building2,
  dacha: Trees,
  mehmonxona: Hotel,
  yer: Map,
  sale: Car,
  rent: CalendarClock,
  models: LayoutGrid,
}

const SHORTCUT_ROUTES = {
  2: 'home',
  3: 'cars',
  4: 'saved',
  5: 'messages',
  6: 'notifications',
}

const routes = {
  home: '/',
  cars: '/avto',
  saved: '/saqlangan',
  messages: '/habarlar',
  notifications: '/notification',
  settings: '/sozlamalar',
  profile: '/profil',
}

function readCollapsed() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === '1') return true
    if (saved === '0') return false
  } catch {
    /* ignore */
  }
  return false
}

export default function Sidebar() {
  const { mobileOpen, onCloseMenu } = useMobileMenu()
  const { mapSearchOpen, openMapSearch, closeMapSearch } = useMapSearch()
  const { profile } = useProfile()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const homeBtnRef = useRef(null)
  const carsBtnRef = useRef(null)

  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [menu, setMenu] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [query, setQuery] = useState('')
  const [menuBox, setMenuBox] = useState(null)

  const compact = collapsed && !mobileOpen
  const hasUnreadMessages = messages.some((item) => item.unread)
  const hasUnreadNotes = notifications.some((item) => item.unread)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  useClickOutside(rootRef, () => {
    setMenu(null)
    setTooltip(null)
  }, Boolean(menu))

  const activeRoute = useMemo(() => {
    if (mapSearchOpen) return 'map'
    if (location.pathname.startsWith('/avto')) return 'cars'
    if (location.pathname.startsWith('/saqlangan')) return 'saved'
    if (location.pathname.startsWith('/habarlar')) return 'messages'
    if (location.pathname.startsWith('/notification')) return 'notifications'
    if (location.pathname.startsWith('/sozlamalar')) return 'settings'
    if (location.pathname.startsWith('/profil')) return 'profile'
    if (location.pathname === '/') return 'home'
    return 'home'
  }, [location.pathname, mapSearchOpen])

  function go(route) {
    setTooltip(null)
    setMenu(null)
    if (route === 'map') {
      if (location.pathname !== '/') navigate('/')
      openMapSearch()
      onCloseMenu?.()
      return
    }
    closeMapSearch()
    navigate(routes[route] || '/')
    onCloseMenu?.()
  }

  function pickHomeKind(kind) {
    closeMapSearch()
    setMenu(null)
    setTooltip(null)
    navigate(`/?kind=${kind}`)
    onCloseMenu?.()
  }

  function pickCarKind(kind) {
    closeMapSearch()
    setMenu(null)
    setTooltip(null)
    navigate(`/avto?kind=${kind}`)
    onCloseMenu?.()
  }

  function onPrimaryClick(item) {
    if (item.route === 'home' || item.route === 'cars') {
      setTooltip(null)
      setMenu((current) => (current === item.route ? null : item.route))
      return
    }
    go(item.route)
  }

  useEffect(() => {
    function onKey(event) {
      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key === '1') {
        event.preventDefault()
        openSearch()
      }
      if (meta && SHORTCUT_ROUTES[event.key]) {
        event.preventDefault()
        go(SHORTCUT_ROUTES[event.key])
      }
      if (event.key === 'Escape') {
        setMenu(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [compact, location.pathname])

  function toggleCollapsed() {
    setCollapsed((value) => !value)
    setMenu(null)
    setTooltip(null)
  }

  function openSearch() {
    if (compact) {
      setCollapsed(false)
      window.setTimeout(() => searchRef.current?.focus(), 80)
      return
    }
    searchRef.current?.focus()
  }

  const needle = query.trim().toLowerCase()
  const match = (label) => !needle || label.toLowerCase().includes(needle)
  const primaryItems = sidebarPrimary.filter((item) => match(item.label))
  const selectedHomeKind = location.pathname === '/' ? searchParams.get('kind') || 'all' : null
  const selectedCarKind = location.pathname.startsWith('/avto') ? searchParams.get('kind') || 'all' : null
  const kindsMenu = menu === 'home' || menu === 'cars'
  const kinds = menu === 'cars' ? CAR_KINDS : HOME_KINDS
  const selectedKind = menu === 'cars' ? selectedCarKind : selectedHomeKind

  useLayoutEffect(() => {
    if (!kindsMenu) {
      setMenuBox(null)
      return undefined
    }

    function place() {
      const el = menu === 'home' ? homeBtnRef.current : carsBtnRef.current
      const sidebar = rootRef.current
      if (!el || !sidebar) return
      const rect = el.getBoundingClientRect()
      const sidebarRect = sidebar.getBoundingClientRect()
      const width = 312
      const left = Math.min(sidebarRect.right + 10, window.innerWidth - width - 12)
      const top = Math.min(rect.top, window.innerHeight - 320)
      setMenuBox({
        top,
        left,
        width,
        maxHeight: Math.max(280, window.innerHeight - top - 16),
      })
    }

    place()
    window.addEventListener('resize', place)
    const scroller = rootRef.current?.querySelector('.sb-scroll')
    scroller?.addEventListener('scroll', place)
    return () => {
      window.removeEventListener('resize', place)
      scroller?.removeEventListener('scroll', place)
    }
  }, [kindsMenu, menu, compact])

  return (
    <aside
      ref={rootRef}
      className={`sidebar${compact ? ' is-collapsed' : ''}${mobileOpen ? ' is-open' : ''}`}
      aria-label="Primary"
    >
      <div className="sb-head">
        <div className="sb-workspace-row">
          <div
            className="sb-workspace"
            onMouseEnter={() => compact && setTooltip('workspace')}
            onMouseLeave={() => setTooltip((current) => (current === 'workspace' ? null : current))}
          >
            <span className="sb-mark sb-mark--brand">
              <img src={logo} alt="" />
            </span>
            <span className="sb-workspace-copy">
              <strong>MixSell</strong>
              <em>Team Plan</em>
            </span>
            {compact && tooltip === 'workspace' ? <span className="sb-tip">MixSell</span> : null}
          </div>
          <div className="sb-head-actions">
            <button
              type="button"
              className="sb-ghost sb-pin"
              aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={toggleCollapsed}
            >
              {compact ? <PanelLeftOpen size={16} strokeWidth={1.7} /> : <PanelLeftClose size={16} strokeWidth={1.7} />}
            </button>
          </div>
        </div>
      </div>

      <div className="sb-search-wrap">
        <label className="sb-search">
          <Search size={16} strokeWidth={1.8} />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search navigation"
            onFocus={openSearch}
          />
          <kbd>⌘1</kbd>
        </label>
        <button
          type="button"
          className="sb-icon-btn"
          aria-label="Search"
          onClick={openSearch}
          onMouseEnter={() => setTooltip('search')}
          onMouseLeave={() => setTooltip((current) => (current === 'search' ? null : current))}
        >
          <Search size={16} strokeWidth={1.8} />
          {compact && tooltip === 'search' ? <span className="sb-tip">Search</span> : null}
        </button>
      </div>

      <nav className="sb-scroll">
        <div className="sb-block">
          <div className="sb-list">
            {primaryItems.map((item) => (
              <NavRow
                key={item.id}
                ref={item.route === 'home' ? homeBtnRef : item.route === 'cars' ? carsBtnRef : undefined}
                icon={NAV_ICONS[item.route] || Home}
                label={item.label}
                shortcut={item.shortcut}
                notify={
                  item.route === 'messages' ? hasUnreadMessages : item.route === 'notifications' ? hasUnreadNotes : item.notify
                }
                active={item.route === activeRoute || menu === item.route}
                expanded={menu === item.route}
                compact={compact}
                tooltip={tooltip}
                onTooltip={setTooltip}
                onClick={() => onPrimaryClick(item)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="sb-foot">
        <div className="sb-block">
          <div className="sb-list">
            <NavRow
              icon={SettingsIcon}
              label="Settings"
              active={activeRoute === 'settings'}
              compact={compact}
              tooltip={tooltip}
              onTooltip={setTooltip}
              onClick={() => go('settings')}
            />
            <NavRow
              icon={CircleHelp}
              label="Help"
              active={menu === 'help'}
              compact={compact}
              tooltip={tooltip}
              onTooltip={setTooltip}
              onClick={() => setMenu((current) => (current === 'help' ? null : 'help'))}
            />
          </div>
          {menu === 'help' ? (
            <div className="sb-popover sb-popover--help" role="dialog" aria-label="Help">
              <strong>Help center</strong>
              <p>Shortcuts, listings, and account support will live here.</p>
            </div>
          ) : null}
        </div>

        <div className="sb-block">
          <button
            type="button"
            className="sb-user"
            aria-haspopup="menu"
            aria-expanded={menu === 'user'}
            onClick={() => setMenu((current) => (current === 'user' ? null : 'user'))}
            onMouseEnter={() => compact && setTooltip('user')}
            onMouseLeave={() => setTooltip((current) => (current === 'user' ? null : current))}
          >
            <img className="sb-avatar" src={profile.avatar} alt="" />
            <span className="sb-user-copy">
              <strong>{profile.name}</strong>
              <em>{profile.email}</em>
            </span>
            <ChevronsUpDown className="sb-chevron" size={16} strokeWidth={1.7} />
            {compact && tooltip === 'user' && menu !== 'user' ? <span className="sb-tip">{profile.name}</span> : null}
          </button>

        {menu === 'user' ? (
          <div className="sb-popover sb-popover--user" role="menu" aria-label="Account">
            <div className="sb-user-card">
              <img className="sb-avatar" src={profile.avatar} alt="" />
              <span>
                <strong>{profile.name}</strong>
                <em>{profile.email}</em>
              </span>
            </div>
            <button type="button" className="sb-menu-item" role="menuitem" onClick={() => go('profile')}>
              <User size={16} strokeWidth={1.8} />
              Profil
            </button>
            <button type="button" className="sb-menu-item sb-menu-item--pro" role="menuitem">
              <Star size={16} strokeWidth={1.8} fill="#f5c518" color="#f5c518" />
              Upgrade to Pro
            </button>
            <button type="button" className="sb-menu-item sb-menu-item--update" role="menuitem">
              <span className="sb-live-dot" />
              Update App
            </button>
            <button type="button" className="sb-menu-item" role="menuitem" onClick={() => setMenu(null)}>
              <LogOut size={16} strokeWidth={1.8} />
              Logout
            </button>
            <p className="sb-legal">
              v0.1.0 <span>·</span> Terms & Conditions
            </p>
          </div>
        ) : null}
        </div>
      </div>
      {kindsMenu && menuBox ? (
        <div
          className="sb-popover sb-popover--kinds"
          role="menu"
          aria-label={menu === 'cars' ? "Avto e'lonlari" : "Uy e'lonlari"}
          style={{
            top: menuBox.top,
            left: menuBox.left,
            width: menuBox.width,
            maxHeight: menuBox.maxHeight,
          }}
        >
          {kinds.map((item) => {
            const selected = item.id === selectedKind
            const count = menu === 'cars' ? carKindCount(item.id) : homeKindCount(item.id)
            const KindIcon = KIND_ICONS[item.id] || Home
            return (
              <button
                type="button"
                key={item.id}
                role="menuitem"
                className={`sb-ws${selected ? ' is-selected' : ''}`}
                onClick={() => (menu === 'cars' ? pickCarKind(item.id) : pickHomeKind(item.id))}
              >
                <GripVertical className="sb-grip" size={14} strokeWidth={2} />
                <span className={`sb-mark sb-mark--${item.tone}`}>
                  <KindIcon size={18} strokeWidth={2.2} />
                </span>
                <span className="sb-ws-copy">
                  <strong>{item.label}</strong>
                  <em>
                    {item.hint} · {formatCount(count, menu === 'cars' && item.id === 'models' ? 'model' : 'e’lon')}
                  </em>
                </span>
                {selected ? <Check size={15} strokeWidth={2.4} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </aside>
  )
}

const NavRow = forwardRef(function NavRow(
  { icon: Icon, label, shortcut, notify, active, expanded, compact, tooltip, onTooltip, onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`sb-item${active ? ' is-active' : ''}`}
      aria-current={active && !expanded ? 'page' : undefined}
      aria-haspopup={expanded != null ? 'menu' : undefined}
      aria-expanded={expanded || undefined}
      onClick={onClick}
      onMouseEnter={() => compact && onTooltip(label)}
      onMouseLeave={() => onTooltip((current) => (current === label ? null : current))}
    >
      <span className="sb-ico">
        <Icon size={18} strokeWidth={active ? 2.1 : 1.75} />
        {notify ? <span className="sb-dot" /> : null}
      </span>
      <span className="sb-label">{label}</span>
      {shortcut ? <kbd>{shortcut}</kbd> : null}
      {compact && tooltip === label ? <span className="sb-tip">{label}</span> : null}
    </button>
  )
})

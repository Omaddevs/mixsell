import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ChevronDown,
  Handshake,
  Heart,
  Menu,
  MessageSquare,
  Monitor,
  Pencil,
  Search,
  Share2,
  User,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CarCard from '../components/CarCard'
import CatalogCard from '../components/CatalogCard'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { useEngagement } from '../context/EngagementContext'
import { useMobileMenu } from '../context/MobileMenuContext'
import { useProfile } from '../context/ProfileContext'
import { regularCars, vipCars } from '../data/cars'
import { messages } from '../data/dashboard'
import { homeListings, regularListings } from '../data/properties'

const ACCOUNT_NAV = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'balance', label: 'Balans', icon: Wallet },
  { id: 'inbox', label: 'Xabarlar', icon: MessageSquare },
  { id: 'verify', label: 'Profilni tasdiqlash', icon: BadgeCheck },
  { id: 'sessions', label: 'Faol sessiyalar', icon: Monitor },
]

const TABS = [
  { id: 'ads', label: 'E’lonlar', icon: Building2 },
  { id: 'buyer', label: 'Xaridor', icon: Handshake },
  { id: 'saved', label: 'Tanlanganlar', icon: Heart },
]

const STATUS = ['Barchasi', 'Faol', 'Arxiv']
const PURPOSE = ['Barchasi', 'Sotuv', 'Ijara']
const KIND = ['Barchasi', 'Uy', 'Avto']
const SORTS = ['Yangi', 'Avval arzon', 'Avval qimmat']

function isCar(item) {
  return Boolean(item.make || item.mileage)
}

function QrMark({ value }) {
  const size = 25
  const modules = []
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const finder =
        (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8)
      if (finder) {
        const inFinder = (px, py) => {
          const dx = px < 7 ? px : px > size - 8 ? px - (size - 7) : px
          const dy = py < 7 ? py : py > size - 8 ? py - (size - 7) : py
          return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
        }
        if (inFinder(x, y)) modules.push(`${x}-${y}`)
        continue
      }
      let h = 2166136261
      const seed = `${value}:${x}:${y}`
      for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
      if (h % 3 !== 0) modules.push(`${x}-${y}`)
    }
  }

  return (
    <svg className="profile-qr" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect width={size} height={size} fill="#fff" />
      {modules.map((key) => {
        const [x, y] = key.split('-').map(Number)
        return <rect key={key} x={x} y={y} width="1" height="1" fill="#111827" />
      })}
    </svg>
  )
}

function VerifySeal() {
  const bumps = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2 - Math.PI / 2
    return {
      cx: 48 + Math.cos(angle) * 37,
      cy: 48 + Math.sin(angle) * 37,
    }
  })

  return (
    <svg className="profile-verify-badge" viewBox="0 0 96 96" aria-hidden="true">
      {bumps.map((bump) => (
        <circle key={`${bump.cx}-${bump.cy}`} cx={bump.cx} cy={bump.cy} r={11} fill="#1363d2" />
      ))}
      <circle cx="48" cy="48" r="34" fill="#1363d2" />
      <path
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7.5"
        d="M31.5 48.5 42.5 59.5 66 34.5"
      />
    </svg>
  )
}

function FilterChip({ label, value, options, onChange }) {
  return (
    <label className="profile-chip">
      <span>{value === options[0] ? label : value}</span>
      <ChevronDown size={14} strokeWidth={2.2} />
      <select value={value} aria-label={label} onChange={(event) => onChange(event.target.value)}>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { onOpenMenu } = useMobileMenu()
  const { savedIds, get } = useEngagement()
  const { profile, updateProfile } = useProfile()
  const [section, setSection] = useState('profile')
  const [tab, setTab] = useState('ads')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(STATUS[0])
  const [purpose, setPurpose] = useState(PURPOSE[0])
  const [kind, setKind] = useState(KIND[0])
  const [sort, setSort] = useState(SORTS[0])
  const [selecting, setSelecting] = useState(false)
  const [picked, setPicked] = useState([])
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState(profile)

  const myListings = useMemo(() => [...homeListings.slice(0, 6), ...vipCars.slice(0, 3)], [])
  const catalog = useMemo(() => [...homeListings, ...regularListings, ...vipCars, ...regularCars], [])

  const savedItems = useMemo(() => {
    const unique = []
    const seen = new Set()
    catalog.forEach((item) => {
      if (!savedIds.includes(item.id) || seen.has(item.id)) return
      seen.add(item.id)
      unique.push(item)
    })
    return unique
  }, [catalog, savedIds])

  const views = myListings.reduce((sum, item) => sum + (get(item).views || item.views || 0), 0)
  const calls = messages.filter((item) => item.role === 'buyer').length

  const buyers = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return messages.filter((item) => {
      if (item.role !== 'buyer') return false
      return !needle || `${item.title} ${item.body}`.toLowerCase().includes(needle)
    })
  }, [query])

  const ads = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const next = myListings.filter((item) => {
      const car = isCar(item)
      if (kind === 'Uy' && car) return false
      if (kind === 'Avto' && !car) return false
      if (purpose === 'Sotuv' && item.deal && item.deal !== 'sale') return false
      if (purpose === 'Ijara' && item.deal && item.deal !== 'rent' && item.deal !== 'daily') return false
      if (status === 'Arxiv') return false
      const hay = `${item.title} ${item.city ?? ''} ${item.street ?? ''}`.toLowerCase()
      return !needle || hay.includes(needle)
    })
    next.sort((a, b) => {
      if (sort === 'Avval arzon') return a.price - b.price
      if (sort === 'Avval qimmat') return b.price - a.price
      return (b.createdAt ?? 0) - (a.createdAt ?? 0)
    })
    return next
  }, [kind, myListings, purpose, query, sort, status])

  const visibleSaved = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return savedItems.filter((item) => {
      const hay = `${item.title} ${item.city ?? ''}`.toLowerCase()
      return !needle || hay.includes(needle)
    })
  }, [query, savedItems])

  function shareProfile() {
    const url = `${window.location.origin}/profil`
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function saveProfile(event) {
    event.preventDefault()
    updateProfile({
      name: draft.name.trim() || profile.name,
      username: draft.username.trim().replace(/\s+/g, '_') || profile.username,
      avatar: draft.avatar || profile.avatar,
    })
    setEditing(false)
  }

  function pickPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => {
      setDraft((current) => ({ ...current, avatar: String(reader.result) }))
    }
    reader.readAsDataURL(file)
  }

  function togglePick(id) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const emptyCopy = {
    ads: 'Hozircha e’lon yo‘q. Yangi uy yoki avto e’lonini qo‘shing.',
    buyer: 'Xaridor so‘rovlari shu yerda ko‘rinadi.',
    saved: 'Tanlangan e’lonlar yo‘q. E’londagi saqlash tugmasini bosing.',
  }

  const gridItems = tab === 'ads' ? ads : tab === 'saved' ? visibleSaved : []
  const EmptyIcon = tab === 'saved' ? Heart : tab === 'buyer' ? Handshake : Building2

  return (
    <Layout variant="home">
      <main className="listings-page profile-page">
        <div className="profile-shell">
          <aside className="profile-nav" aria-label="Hisob menyusi">
            {ACCOUNT_NAV.map((item) => {
              const Icon = item.icon
              const on = section === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={on ? 'is-on' : undefined}
                  onClick={() => setSection(item.id)}
                >
                  {item.id === 'verify' ? (
                    <span className="profile-nav-seal" aria-hidden="true">
                      <Check size={11} strokeWidth={3.2} />
                    </span>
                  ) : (
                    <Icon size={18} strokeWidth={on ? 2.2 : 1.8} />
                  )}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </aside>

          <div className="profile-main">
            {section === 'profile' ? (
              <>
                <header className="profile-top">
                  <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
                    <Menu size={18} />
                  </button>
                  <div className="profile-who">
                    <img className="profile-avatar" src={profile.avatar} alt="" />
                    <span>
                      <strong>@{profile.username}</strong>
                      <em>ID: {profile.id}</em>
                    </span>
                  </div>
                  <div className="profile-actions">
                    <button type="button" className="profile-btn" onClick={shareProfile}>
                      {copied ? <Check size={16} strokeWidth={2.2} /> : <Share2 size={16} strokeWidth={2} />}
                      {copied ? 'Nusxa olindi' : 'Ulashish'}
                    </button>
                    <button
                      type="button"
                      className="profile-btn is-primary"
                      onClick={() => {
                        setDraft(profile)
                        setEditing(true)
                      }}
                    >
                      <Pencil size={15} strokeWidth={2.1} />
                      Profilni tahrirlash
                    </button>
                  </div>
                </header>

                <h1 className="profile-name">{profile.name}</h1>

                <section className="profile-stats" aria-label="Statistika">
                  {[
                    ['E’lonlar', myListings.length],
                    ['Ko‘rishlar', views],
                    ['Qo‘ng‘iroqlar', calls],
                    ['Sotuvlar', 0],
                  ].map(([label, value]) => (
                    <article key={label}>
                      <b>{value}</b>
                      <span>{label}</span>
                    </article>
                  ))}
                </section>

                <div className="profile-tabs" role="tablist" aria-label="Profil bo‘limlari">
                  {TABS.map((item) => {
                    const Icon = item.icon
                    const on = tab === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        className={on ? 'is-on' : undefined}
                        onClick={() => {
                          setTab(item.id)
                          setSelecting(false)
                          setPicked([])
                        }}
                      >
                        <Icon size={18} strokeWidth={on ? 2.2 : 1.8} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                {tab === 'ads' ? (
                  <div className="profile-tools">
                    <div className="profile-filters">
                      <FilterChip label="Statusi" value={status} options={STATUS} onChange={setStatus} />
                      <FilterChip label="E’lon maqsadi" value={purpose} options={PURPOSE} onChange={setPurpose} />
                      <FilterChip label="Mulk toifasi" value={kind} options={KIND} onChange={setKind} />
                      <FilterChip label="Saralash" value={sort} options={SORTS} onChange={setSort} />
                      <button type="button" className="profile-multi" onClick={() => setSelecting((value) => !value)}>
                        {selecting ? 'Bekor qilish' : 'Ko‘p tanlash'}
                      </button>
                    </div>
                    <label className="profile-search">
                      <Search size={16} strokeWidth={2} />
                      <input
                        type="search"
                        value={query}
                        placeholder="Qidirish"
                        aria-label="E’lonlarni qidirish"
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="profile-search profile-search--solo">
                    <Search size={16} strokeWidth={2} />
                    <input
                      type="search"
                      value={query}
                      placeholder="Qidirish"
                      aria-label="Qidirish"
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                )}

                {tab === 'buyer' ? (
                  buyers.length ? (
                    <ul className="profile-buyers">
                      {buyers.map((item) => (
                        <li key={item.id}>
                          <button type="button" className="profile-buyer" onClick={() => navigate('/habarlar')}>
                            {item.avatar ? <img src={item.avatar} alt="" /> : <span>{item.title.slice(0, 1)}</span>}
                            <b>
                              <strong>{item.title}</strong>
                              <em>{item.body}</em>
                            </b>
                            <time>{item.time}</time>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="profile-empty">
                      <span className="profile-empty-mark">
                        <i />
                        <i />
                        <i />
                        <i />
                        <Handshake size={34} strokeWidth={1.8} />
                      </span>
                      <p>{emptyCopy.buyer}</p>
                    </div>
                  )
                ) : gridItems.length ? (
                  <div className="catalog-grid" aria-label={tab === 'ads' ? 'Mening e’lonlarim' : 'Tanlangan e’lonlar'}>
                    {gridItems.map((item) => (
                      <div key={item.id} className={`profile-card${selecting && tab === 'ads' ? ' is-pick' : ''}`}>
                        {selecting && tab === 'ads' ? (
                          <label className="profile-pick">
                            <input type="checkbox" checked={picked.includes(item.id)} onChange={() => togglePick(item.id)} />
                          </label>
                        ) : null}
                        {isCar(item) ? <CarCard car={item} /> : <CatalogCard listing={item} />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="profile-empty">
                    <span className="profile-empty-mark">
                      <i />
                      <i />
                      <i />
                      <i />
                      <EmptyIcon size={34} strokeWidth={1.8} />
                    </span>
                    <p>{emptyCopy[tab]}</p>
                  </div>
                )}
              </>
            ) : null}

            {section === 'verify' ? (
              <section className="profile-verify" aria-labelledby="verify-title">
                <VerifySeal />
                <h2 id="verify-title">Verifikatsiya ilova orqali</h2>
                <p>
                  Hisobingizni tasdiqlash MixSell ilovasida amalga oshiriladi.
                  <br />
                  Ilovani yuklab oling va tekshiruvdan o‘ting.
                </p>
                <div className="profile-qr-wrap">
                  <QrMark value="https://mixsells.com/app?verify=1" />
                </div>
                <em>Yuklab olish uchun QR-kodni skanerlang</em>
              </section>
            ) : null}

            {section === 'balance' ? (
              <section className="profile-panel">
                <h2>Balans</h2>
                <p className="profile-balance">$0.00</p>
                <p>Hisobingizdagi mablag‘ e’lonlarni ko‘tarish va Premium uchun ishlatiladi.</p>
                <button type="button" className="profile-btn is-primary">
                  Hisobni to‘ldirish
                </button>
              </section>
            ) : null}

            {section === 'inbox' ? (
              <section className="profile-panel">
                <h2>Xabarlar</h2>
                <ul className="profile-buyers">
                  {messages.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <button type="button" className="profile-buyer" onClick={() => navigate('/habarlar')}>
                        {item.avatar ? <img src={item.avatar} alt="" /> : <span>{item.title.slice(0, 1)}</span>}
                        <b>
                          <strong>{item.title}</strong>
                          <em>{item.body}</em>
                        </b>
                        <time>{item.time}</time>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {section === 'sessions' ? (
              <section className="profile-panel">
                <h2>Faol sessiyalar</h2>
                <ul className="profile-sessions">
                  <li>
                    <strong>Windows · Chrome</strong>
                    <em>Toshkent · hozir</em>
                    <b>Joriy</b>
                  </li>
                  <li>
                    <strong>iPhone · Safari</strong>
                    <em>Toshkent · 2 soat oldin</em>
                    <button type="button" className="profile-btn">
                      Chiqish
                    </button>
                  </li>
                </ul>
              </section>
            ) : null}
          </div>
        </div>

        {editing ? (
          <Modal title="Profilni tahrirlash" onClose={() => setEditing(false)} className="profile-modal">
            <form className="profile-form" onSubmit={saveProfile}>
              <label className="profile-photo-edit">
                <img src={draft.avatar} alt="" />
                <span>
                  <Camera size={16} strokeWidth={2.1} />
                  Rasmni o‘zgartirish
                </span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickPhoto} />
              </label>
              <label>
                Ism
                <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label>
                Username
                <input
                  value={draft.username}
                  onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
                />
              </label>
              <div className="profile-form-actions">
                <button type="button" className="profile-btn" onClick={() => setEditing(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="profile-btn is-primary">
                  Saqlash
                </button>
              </div>
            </form>
          </Modal>
        ) : null}
      </main>
    </Layout>
  )
}

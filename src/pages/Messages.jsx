import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  CalendarClock,
  Car,
  Check,
  CheckCheck,
  ChevronRight,
  Crown,
  DoorOpen,
  ExternalLink,
  Gauge,
  Image as ImageIcon,
  Info,
  LandPlot,
  MapPin,
  Maximize2,
  Menu,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Smile,
  Video,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useMobileMenu } from '../context/MobileMenuContext'
import { messages as seedMessages } from '../data/dashboard'
import logo from '../assets/logo-mini.svg'

const TABS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'buyer', label: 'Xaridorlar' },
  { id: 'seller', label: 'Sotuvchilar' },
  { id: 'archive', label: 'Arxiv' },
]

const QUICK = [
  { id: 'hi', label: 'Salom!', text: 'Salom!' },
  { id: 'addr', label: 'Manzilni yuborish', type: 'map' },
  { id: 'meet', label: 'Uchrashuv belgilash', text: 'Uchrashuvni belgilaylik: ertaga 11:00' },
  { id: 'price', label: 'Narx haqida', text: 'Yakuniy narx qancha?' },
]

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function specIcon(label) {
  const text = label.toLowerCase()
  if (text.includes('sotix')) return <LandPlot size={14} strokeWidth={2.1} />
  if (text.includes('xona')) return <DoorOpen size={14} strokeWidth={2.1} />
  if (text.includes('m²') || text.includes('m2')) return <Maximize2 size={14} strokeWidth={2.1} />
  if (text.includes('km')) return <Gauge size={14} strokeWidth={2.1} />
  if (text.includes('sedan') || text.includes('avto')) return <Car size={14} strokeWidth={2.1} />
  return <Info size={14} strokeWidth={2.1} />
}

function Avatar({ chat, size = 48 }) {
  return (
    <span className="chat-avatar-wrap" style={{ width: size, height: size }}>
      <span className="chat-avatar" style={{ background: chat.tone }}>
        {chat.avatar ? <img src={chat.avatar} alt="" /> : initials(chat.title)}
      </span>
      {chat.online ? <i className="chat-online" /> : null}
    </span>
  )
}

function ticks(status) {
  if (status === 'read') return <CheckCheck size={14} strokeWidth={2.4} />
  return <Check size={14} strokeWidth={2.4} />
}

function nowStamp() {
  return new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}

export default function Messages() {
  const navigate = useNavigate()
  const { onOpenMenu } = useMobileMenu()
  const [chats, setChats] = useState(seedMessages)
  const [activeId, setActiveId] = useState(seedMessages[0]?.id ?? null)
  const [view, setView] = useState('list')
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [photo, setPhoto] = useState(0)
  const [typing, setTyping] = useState(false)
  const scrollerRef = useRef(null)
  const inputRef = useRef(null)
  const searchRef = useRef(null)

  const needle = query.trim().toLowerCase()
  const visibleChats = useMemo(
    () =>
      chats.filter((item) => {
        if (tab === 'archive') return Boolean(item.archived)
        if (item.archived) return false
        if (tab === 'buyer' && item.role !== 'buyer') return false
        if (tab === 'seller' && item.role !== 'seller') return false
        const hay = `${item.title} ${item.body} ${item.listing?.title ?? ''}`.toLowerCase()
        return !needle || hay.includes(needle)
      }),
    [chats, needle, tab],
  )

  const active = chats.find((item) => item.id === activeId) ?? null
  const listing = active?.listing
  const gallery = listing?.gallery ?? (listing?.image ? [listing.image] : [])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [active?.id, active?.thread.length, typing])

  useEffect(() => {
    setPhoto(0)
    setTyping(false)
    if (!active?.online) return undefined
    const start = window.setTimeout(() => setTyping(true), 600)
    const stop = window.setTimeout(() => setTyping(false), 2800)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(stop)
    }
  }, [active?.id, active?.online])

  function openChat(id) {
    setActiveId(id)
    setView('thread')
    setChats((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false, unreadCount: 0 } : item)),
    )
    window.setTimeout(() => inputRef.current?.focus(), 40)
  }

  function pushMessage(payload) {
    if (!active) return
    const next = {
      id: `n-${Date.now()}`,
      from: 'me',
      time: nowStamp(),
      day: 'Bugun',
      status: 'sent',
      ...payload,
    }
    const preview = payload.text || (payload.type === 'map' ? 'Manzil yuborildi' : 'E’lon yuborildi')
    setChats((current) =>
      current.map((item) =>
        item.id === active.id
          ? { ...item, body: preview, time: 'Hozir', thread: [...item.thread, next] }
          : item,
      ),
    )
  }

  function sendMessage(event) {
    event?.preventDefault()
    const text = draft.trim()
    if (!text) return
    pushMessage({ text })
    setDraft('')
  }

  function sendQuick(item) {
    if (item.type === 'map') {
      pushMessage({ type: 'map', place: listing?.location || 'Toshkent' })
      return
    }
    pushMessage({ text: item.text })
  }

  const grouped = []
  if (active) {
    active.thread.forEach((item) => {
      const last = grouped[grouped.length - 1]
      if (!last || last.day !== item.day) grouped.push({ day: item.day, items: [item] })
      else last.items.push(item)
    })
  }

  return (
    <Layout variant="home" hero={false}>
      <main className="listings-page listings-page--messenger">
        <section className={`chat-desk is-${view}`} aria-label="Chat">
          <aside className="chat-col chat-col--list">
            <div className="chat-brand">
              <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
                <Menu size={18} />
              </button>
              <span className="chat-brand-logo">
                <img src={logo} alt="" />
              </span>
              <span className="chat-brand-copy">
                <strong>MixSell</strong>
                <em>Uy va avto bir joyda</em>
              </span>
              <button type="button" className="chat-add" aria-label="Yangi chat" onClick={() => searchRef.current?.focus()}>
                <Plus size={18} strokeWidth={2.4} />
              </button>
            </div>

            <div className="chat-list-head">
              <strong>Chatlar</strong>
              <em>Sotuvchilar va xaridorlar</em>
            </div>

            <div className="chat-search">
              <Search size={16} strokeWidth={2} />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Qidirish..."
                aria-label="Chatlarni qidirish"
              />
              <button type="button" className="chat-search-filter" aria-label="Filtr">
                <SlidersHorizontal size={15} strokeWidth={2} />
              </button>
            </div>

            <div className="chat-tabs" role="tablist" aria-label="Chat filtri">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={tab === item.id ? 'is-on' : undefined}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="chat-people">
              {visibleChats.length ? (
                visibleChats.map((chat) => {
                  const selected = chat.id === active?.id
                  return (
                    <button
                      type="button"
                      key={chat.id}
                      className={`chat-person${selected ? ' is-on' : ''}${chat.unread ? ' is-unread' : ''}`}
                      aria-current={selected ? 'true' : undefined}
                      onClick={() => openChat(chat.id)}
                    >
                      <Avatar chat={chat} />
                      <span className="chat-person-copy">
                        <span className="chat-person-top">
                          <strong>
                            <span>{chat.title}</span>
                            {chat.verified ? <BadgeCheck size={14} strokeWidth={2.2} /> : null}
                          </strong>
                          <time>{chat.time}</time>
                        </span>
                        <span className="chat-person-bottom">
                          <em>{chat.body}</em>
                          {chat.unreadCount ? <b>{chat.unreadCount}</b> : null}
                        </span>
                      </span>
                    </button>
                  )
                })
              ) : (
                <p className="chat-empty">{tab === 'archive' ? 'Arxiv hozircha bo‘sh.' : 'Hech narsa topilmadi.'}</p>
              )}
            </div>

            <div className="chat-premium">
              <span>
                <Crown size={16} strokeWidth={2} />
                Premium
              </span>
              <em>Premium bilan ko‘proq mijozlarga erishing!</em>
              <ChevronRight size={16} />
            </div>
          </aside>

          {active ? (
            <div className="chat-col chat-col--thread">
              <header className="chat-thread-head">
                <button type="button" className="chat-back" aria-label="Chatlarga qaytish" onClick={() => setView('list')}>
                  <ArrowLeft size={18} strokeWidth={2.1} />
                </button>
                <Avatar chat={active} size={42} />
                <div className="chat-thread-who">
                  <strong>
                    <span>{active.title}</span>
                    {active.verified ? <BadgeCheck size={15} strokeWidth={2.2} /> : null}
                  </strong>
                  <em className={active.online ? 'is-live' : undefined}>
                    {active.online ? 'Onlayn' : active.seen}
                  </em>
                </div>
                <div className="chat-thread-actions">
                  <button type="button" aria-label="Qo‘ng‘iroq">
                    <Phone size={17} strokeWidth={1.9} />
                  </button>
                  <button type="button" aria-label="Video qo‘ng‘iroq">
                    <Video size={17} strokeWidth={1.9} />
                  </button>
                  <button type="button" aria-label="E’lon tafsilotlari" onClick={() => setView('details')}>
                    <Info size={17} strokeWidth={1.9} />
                  </button>
                  <button type="button" aria-label="Yana">
                    <MoreVertical size={17} strokeWidth={1.9} />
                  </button>
                </div>
              </header>

              <div className="chat-scroll" ref={scrollerRef}>
                {grouped.map((group) => (
                  <div key={group.day} className="chat-day">
                    <span>{group.day}</span>
                    {group.items.map((item) => (
                      <div key={item.id} className={`chat-row chat-row--${item.from}`}>
                        {item.from === 'them' ? <Avatar chat={active} size={28} /> : null}
                        <div className={`chat-bubble chat-bubble--${item.from}`}>
                          {item.type === 'listing' && listing ? (
                            <button type="button" className="chat-card" onClick={() => setView('details')}>
                              <img src={listing.image} alt="" />
                              <span className="chat-card-copy">
                                <strong>{listing.title}</strong>
                                <em>{listing.price}</em>
                                <small>{listing.location}</small>
                                <b>
                                  E’lonni ko‘rish
                                  <ChevronRight size={14} />
                                </b>
                              </span>
                            </button>
                          ) : null}
                          {item.type === 'map' ? (
                            <div className="chat-map">
                              <MapPin size={22} strokeWidth={2.2} />
                              <b>{item.place || listing?.location}</b>
                              <small>Ko‘rik nuqtasi</small>
                            </div>
                          ) : null}
                          {item.text ? <p>{item.text}</p> : null}
                          <small>
                            {item.time}
                            {item.from === 'me' ? ticks(item.status) : null}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {typing ? (
                  <div className="chat-row chat-row--them">
                    <Avatar chat={active} size={28} />
                    <div className="chat-typing" aria-label="Yozmoqda">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                ) : null}
              </div>

              <form className="chat-composer" onSubmit={sendMessage}>
                <div className="chat-input-bar">
                  <button type="button" aria-label="Fayl">
                    <Paperclip size={18} strokeWidth={1.9} />
                  </button>
                  <button type="button" aria-label="Rasm">
                    <ImageIcon size={18} strokeWidth={1.9} />
                  </button>
                  <label>
                    <span className="sr-only">Xabar</span>
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Xabar yozing..."
                    />
                  </label>
                  <button type="button" aria-label="Stiker">
                    <Smile size={18} strokeWidth={1.9} />
                  </button>
                  <button type="submit" className="chat-send" aria-label="Yuborish" disabled={!draft.trim()}>
                    <Send size={16} strokeWidth={2.2} />
                  </button>
                </div>
              </form>

              <div className="chat-quick">
                {QUICK.map((item) => (
                  <button key={item.id} type="button" onClick={() => sendQuick(item)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-col chat-col--thread chat-thread--empty">
              <p>Suhbatni tanlang</p>
            </div>
          )}

          <aside className="chat-col chat-col--info">
            {listing && active ? (
              <>
                <div className="chat-info-head">
                  <button type="button" className="chat-back" aria-label="Chatga qaytish" onClick={() => setView('thread')}>
                    <ArrowLeft size={18} strokeWidth={2.1} />
                  </button>
                  <strong>E’lon</strong>
                </div>
                <img className="chat-hero" src={gallery[photo] || listing.image} alt="" />
                <div className="chat-thumbs">
                  {gallery.slice(0, 4).map((src, index) => (
                    <button
                      key={src + index}
                      type="button"
                      className={photo === index ? 'is-on' : undefined}
                      onClick={() => setPhoto(index)}
                    >
                      <img src={src} alt="" />
                      {index === 3 && listing.extraPhotos ? <span>+{listing.extraPhotos}</span> : null}
                    </button>
                  ))}
                </div>
                <div className="chat-info-copy">
                  <h2>{listing.title}</h2>
                  <p className="chat-price">
                    {listing.price}
                    <b>{listing.status}</b>
                  </p>
                  <p className="chat-place">
                    <MapPin size={14} strokeWidth={2.2} />
                    {listing.location}
                  </p>
                  <div className="chat-specs">
                    {listing.specs?.map((item) => (
                      <span key={item}>
                        {specIcon(item)}
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="chat-owner-label">E’lon egasi</p>
                <div className="chat-seller">
                  <Avatar chat={active} size={40} />
                  <span>
                    <strong>{active.title}</strong>
                    <em className={active.online ? 'is-live' : undefined}>{active.online ? 'Onlayn' : active.seen}</em>
                  </span>
                  <button type="button">Profilni ko‘rish</button>
                </div>
                <button
                  type="button"
                  className="chat-open-ad"
                  onClick={() => navigate(listing.kind === 'car' ? '/avto' : '/')}
                >
                  E’lonni ochish
                  <ExternalLink size={16} strokeWidth={2.1} />
                </button>
                <div className="chat-actions">
                  <button type="button" onClick={() => sendQuick(QUICK[1])}>
                    <MapPin size={16} />
                    Manzilni yuborish
                  </button>
                  <button type="button" onClick={() => sendQuick(QUICK[2])}>
                    <CalendarClock size={16} />
                    Uchrashuv belgilash
                  </button>
                  <button type="button" onClick={() => sendQuick(QUICK[3])}>
                    <Info size={16} />
                    Narx haqida
                  </button>
                  <button type="button">
                    <Share2 size={16} />
                    E’lonni ulashish
                  </button>
                  <button type="button" className="is-danger">
                    <Ban size={16} />
                    Foydalanuvchini bloklash
                  </button>
                </div>
                <div className="chat-safe">
                  <ShieldCheck size={18} />
                  <span>
                    <strong>Xavfsiz savdo</strong>
                    <em>Shaxsiy ma’lumotni ehtiyot qiling. To‘lovni faqat uchrashuvda qiling.</em>
                  </span>
                </div>
              </>
            ) : (
              <p className="chat-empty">E’lon tanlanmagan</p>
            )}
          </aside>
        </section>
      </main>
    </Layout>
  )
}

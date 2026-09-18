import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Heart, MessageCircle, Moon, Phone, Sun } from 'lucide-react'
import { messages, notifications } from '../data/dashboard'
import { useEngagement } from '../context/EngagementContext'
import { useTheme } from '../context/ThemeContext'
import logo from '../assets/logo-mini.svg'

const PHONE_DISPLAY = '+998 555 888 111'
const PHONE_HREF = 'tel:+998555888111'

export default function TopBar() {
  const navigate = useNavigate()
  const { savedIds } = useEngagement()
  const { isDark, toggleTheme } = useTheme()
  const unreadMessages = messages.filter((item) => item.unread).length
  const unreadNotifications = notifications.filter((item) => item.unread).length

  return (
    <div className="topbar">
      <button type="button" className="topbar-brand" onClick={() => navigate('/')}>
        <img src={logo} alt="" />
        <span>MixSell</span>
      </button>
      <a className="topbar-phone" href={PHONE_HREF}>
        <Phone size={15} strokeWidth={2.2} />
        <span>{PHONE_DISPLAY}</span>
      </a>

      <div className="topbar-actions">
        <button
          type="button"
          className="topbar-icon"
          aria-label={isDark ? "Yorug' rejim" : "Tungi rejim"}
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={17} strokeWidth={1.9} /> : <Moon size={17} strokeWidth={1.9} />}
        </button>

        <button
          type="button"
          className="topbar-icon topbar-icon--chat"
          aria-label="Habarlar"
          onClick={() => navigate('/habarlar')}
        >
          <MessageCircle size={17} strokeWidth={1.9} />
          {unreadMessages ? <span className="topbar-dot" /> : null}
        </button>

        <button
          type="button"
          className="topbar-icon"
          aria-label="Saqlangan e’lonlar"
          onClick={() => navigate('/saqlangan')}
        >
          <Heart size={17} strokeWidth={1.9} />
          {savedIds.length ? <span className="topbar-count">{savedIds.length}</span> : null}
        </button>

        <button
          type="button"
          className="topbar-icon"
          aria-label="Bildirishnomalar"
          onClick={() => navigate('/notification')}
        >
          <Bell size={17} strokeWidth={1.9} />
          <span className="topbar-count topbar-count--green">{unreadNotifications}</span>
        </button>

        <LocaleSwitch />

        <button type="button" className="topbar-login" onClick={() => navigate('/profil')}>
          Kirish
        </button>
      </div>
    </div>
  )
}

function LocaleSwitch() {
  const [lang, setLang] = useState('uz')
  const [currency, setCurrency] = useState('sum')

  return (
    <div className="locale-switch">
      <button
        type="button"
        className="locale-seg"
        aria-label="Til"
        onClick={() => setLang((value) => (value === 'uz' ? 'ru' : 'uz'))}
      >
        {lang.toUpperCase()}
      </button>
      <span className="locale-divider" aria-hidden="true" />
      <button
        type="button"
        className="locale-seg locale-seg--text"
        aria-label="Valyuta"
        onClick={() => setCurrency((value) => (value === 'sum' ? 'usd' : 'sum'))}
      >
        {currency === 'sum' ? "So'm" : 'USD'}
      </button>
    </div>
  )
}

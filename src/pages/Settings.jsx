import { useEffect, useState } from 'react'
import { Bell, Camera, Check, KeyRound, Lock, Menu, Moon, ShieldCheck, User } from 'lucide-react'
import Layout from '../components/Layout'
import Toggle from '../components/Toggle'
import { useMobileMenu } from '../context/MobileMenuContext'
import { useProfile } from '../context/ProfileContext'
import { useTheme } from '../context/ThemeContext'

const STORAGE_KEY = 'mixsell-settings'

const NAV = [
  { id: 'account', label: 'Hisob', icon: User },
  { id: 'appearance', label: "Ko'rinish", icon: Moon },
  { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
  { id: 'privacy', label: 'Maxfiylik', icon: Lock },
  { id: 'security', label: 'Xavfsizlik', icon: ShieldCheck },
]

const DEFAULTS = {
  notifyEmail: true,
  notifyPush: true,
  notifySms: false,
  notifyMarketing: false,
  showPhone: true,
  showOnline: true,
  privateProfile: false,
}

function readSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export default function Settings() {
  const { onOpenMenu } = useMobileMenu()
  const { profile, updateProfile } = useProfile()
  const { isDark, toggleTheme } = useTheme()
  const [section, setSection] = useState('account')
  const [settings, setSettings] = useState(readSettings)
  const [saved, setSaved] = useState(false)
  const [draft, setDraft] = useState({ name: profile.name, username: profile.username })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  function toggle(key) {
    setSettings((current) => ({ ...current, [key]: !current[key] }))
  }

  function saveAccount(event) {
    event.preventDefault()
    updateProfile({
      name: draft.name.trim() || profile.name,
      username: draft.username.trim().replace(/\s+/g, '_') || profile.username,
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  function pickPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => updateProfile({ avatar: String(reader.result) })
    reader.readAsDataURL(file)
  }

  function savePassword(event) {
    event.preventDefault()
    setPasswordError('')
    if (!password.current || !password.next) {
      setPasswordError('Barcha maydonlarni to‘ldiring')
      return
    }
    if (password.next.length < 8) {
      setPasswordError('Yangi parol kamida 8 belgidan iborat bo‘lishi kerak')
      return
    }
    if (password.next !== password.confirm) {
      setPasswordError('Parollar mos kelmadi')
      return
    }
    setPassword({ current: '', next: '', confirm: '' })
    setPasswordSaved(true)
    window.setTimeout(() => setPasswordSaved(false), 1600)
  }

  return (
    <Layout variant="home" hero={false}>
      <main className="listings-page profile-page settings-page">
        <div className="profile-shell">
          <aside className="profile-nav" aria-label="Sozlamalar menyusi">
            {NAV.map((item) => {
              const Icon = item.icon
              const on = section === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={on ? 'is-on' : undefined}
                  onClick={() => setSection(item.id)}
                >
                  <Icon size={18} strokeWidth={on ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </aside>

          <div className="profile-main">
            <header className="profile-top">
              <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
                <Menu size={18} />
              </button>
              <div className="profile-who">
                <span>
                  <strong>Sozlamalar</strong>
                  <em>Hisobingiz va afzalliklaringizni boshqaring</em>
                </span>
              </div>
            </header>

            {section === 'account' ? (
              <section className="profile-panel">
                <h2>Hisob ma’lumotlari</h2>
                <p>Ism, foydalanuvchi nomi va profil rasmingizni yangilang.</p>
                <form className="profile-form" onSubmit={saveAccount}>
                  <label className="profile-photo-edit">
                    <img src={profile.avatar} alt="" />
                    <span>
                      <Camera size={16} strokeWidth={2.1} />
                      Rasmni o‘zgartirish
                    </span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickPhoto} />
                  </label>
                  <label>
                    Ism
                    <input
                      value={draft.name}
                      onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                    />
                  </label>
                  <label>
                    Username
                    <input
                      value={draft.username}
                      onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
                    />
                  </label>
                  <label>
                    Email
                    <input value={profile.email} disabled />
                  </label>
                  <div className="profile-form-actions">
                    {saved ? (
                      <span className="settings-saved">
                        <Check size={15} strokeWidth={2.4} /> Saqlandi
                      </span>
                    ) : null}
                    <button type="submit" className="profile-btn is-primary">
                      Saqlash
                    </button>
                  </div>
                </form>
              </section>
            ) : null}

            {section === 'appearance' ? (
              <section className="profile-panel">
                <h2>Ko'rinish</h2>
                <p>Ilova mavzusini tanlang.</p>
                <div className="settings-toggles">
                  <Toggle
                    checked={isDark}
                    onChange={toggleTheme}
                    label="Tungi rejim"
                    hint="Ilovani qorong'i mavzuda ko'rsatish"
                  />
                </div>
              </section>
            ) : null}

            {section === 'notifications' ? (
              <section className="profile-panel">
                <h2>Bildirishnomalar</h2>
                <p>Qaysi bildirishnomalarni olishni xohlaysiz shuni tanlang.</p>
                <div className="settings-toggles">
                  <Toggle
                    checked={settings.notifyEmail}
                    onChange={() => toggle('notifyEmail')}
                    label="Email orqali bildirishnomalar"
                    hint="Yangi xabar va so‘rovlar haqida email kelib turadi"
                  />
                  <Toggle
                    checked={settings.notifyPush}
                    onChange={() => toggle('notifyPush')}
                    label="Push bildirishnomalar"
                    hint="Brauzer va ilova orqali tezkor bildirishnomalar"
                  />
                  <Toggle
                    checked={settings.notifySms}
                    onChange={() => toggle('notifySms')}
                    label="SMS bildirishnomalar"
                    hint="Muhim holatlarda telefon raqamingizga SMS yuboriladi"
                  />
                  <Toggle
                    checked={settings.notifyMarketing}
                    onChange={() => toggle('notifyMarketing')}
                    label="Marketing va aksiyalar"
                    hint="Chegirmalar va yangiliklar haqida xabarlar"
                  />
                </div>
              </section>
            ) : null}

            {section === 'privacy' ? (
              <section className="profile-panel">
                <h2>Maxfiylik</h2>
                <p>Profilingiz boshqalarga qanday ko‘rinishini boshqaring.</p>
                <div className="settings-toggles">
                  <Toggle
                    checked={settings.privateProfile}
                    onChange={() => toggle('privateProfile')}
                    label="Profilni yopiq qilish"
                    hint="Faqat sizga yozgan xaridorlar profilingizni ko‘ra oladi"
                  />
                  <Toggle
                    checked={settings.showPhone}
                    onChange={() => toggle('showPhone')}
                    label="Telefon raqamini ko‘rsatish"
                    hint="E’lonlaringizda telefon raqamingiz ko‘rinadi"
                  />
                  <Toggle
                    checked={settings.showOnline}
                    onChange={() => toggle('showOnline')}
                    label="Onlayn holatni ko‘rsatish"
                    hint="Suhbatda oxirgi faollik vaqtingiz ko‘rinadi"
                  />
                </div>
              </section>
            ) : null}

            {section === 'security' ? (
              <section className="profile-panel">
                <h2>Xavfsizlik</h2>
                <p>Parolingizni yangilang va faol sessiyalarni nazorat qiling.</p>
                <form className="profile-form" onSubmit={savePassword}>
                  <label>
                    Joriy parol
                    <input
                      type="password"
                      value={password.current}
                      onChange={(event) => setPassword((current) => ({ ...current, current: event.target.value }))}
                    />
                  </label>
                  <label>
                    Yangi parol
                    <input
                      type="password"
                      value={password.next}
                      onChange={(event) => setPassword((current) => ({ ...current, next: event.target.value }))}
                    />
                  </label>
                  <label>
                    Yangi parolni tasdiqlang
                    <input
                      type="password"
                      value={password.confirm}
                      onChange={(event) => setPassword((current) => ({ ...current, confirm: event.target.value }))}
                    />
                  </label>
                  {passwordError ? <p className="settings-error">{passwordError}</p> : null}
                  <div className="profile-form-actions">
                    {passwordSaved ? (
                      <span className="settings-saved">
                        <Check size={15} strokeWidth={2.4} /> Parol yangilandi
                      </span>
                    ) : null}
                    <button type="submit" className="profile-btn is-primary">
                      <KeyRound size={15} strokeWidth={2.1} />
                      Parolni yangilash
                    </button>
                  </div>
                </form>

                <h2 style={{ marginTop: 8 }}>Faol sessiyalar</h2>
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
      </main>
    </Layout>
  )
}

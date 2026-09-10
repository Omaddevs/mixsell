import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  Folder,
  GraduationCap,
  Library,
  LifeBuoy,
  LineChart as LineChartIcon,
  Megaphone,
  MessageSquareWarning,
  Newspaper,
  QrCode,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useCurrentUser, useStore } from '../store/useStore'
import { calcPercentage, percentTone, STATUS, summarize } from '../lib/attendance'
import { Avatar, Badge } from '../components/ui'
import { BannerStrip, IconGridItem, QuickBlue, QrBtn, shortName } from '../components/HemisUI'
import { matchesDate } from '../lib/schedule'
import { ROLE_LABEL } from '../lib/utils'

export default function Dashboard() {
  const me = useCurrentUser()
  if (me?.role === 'student') return <StudentHome />
  if (me?.role === 'teacher') return <TeacherHome />
  return <AdminHome />
}

function AdminHome() {
  const me = useCurrentUser()
  const users = useStore((s) => s.users)
  const attendance = useStore((s) => s.attendance)
  const complaints = useStore((s) => s.complaints)
  const announcements = useStore((s) => s.announcements)
  const posts = useStore((s) => s.posts)
  const students = users.filter((u) => u.role === 'student')
  const teachers = users.filter((u) => u.role === 'teacher')
  const avg = Math.round(
    (students.reduce((s, u) => s + calcPercentage(attendance.filter((a) => a.studentId === u.id)), 0) / Math.max(1, students.length)) * 10,
  ) / 10
  const openC = complaints.filter((c) => c.status !== 'resolved').length
  const sum = summarize(attendance)
  const pie = [
    { name: 'Kelgan', value: sum.present, color: '#10b981' },
    { name: 'Kechikkan', value: sum.late, color: '#f59e0b' },
    { name: 'Kelmadi', value: sum.absent, color: '#f43f5e' },
  ]
  const line = weekLine(attendance)

  const quickActions = [
    { label: 'Foydalanuvchilar', sub: 'Barcha a’zolar', icon: Users, to: '/users' },
    { label: 'Guruhlar', sub: 'Guruhlarni boshqarish', icon: Shield, to: '/groups' },
    { label: 'Hisobotlar', sub: 'Statistika va export', icon: BookOpen, to: '/reports' },
    { label: 'Dars jadvali', sub: 'Darslarni qo‘shish', icon: CalendarDays, to: '/schedule' },
  ]
  const iconTiles = [
    { label: 'Davomat', icon: ClipboardList, to: '/attendance' },
    { label: 'O‘qituvchilar', icon: GraduationCap, to: '/teachers' },
    { label: 'Talabalar', icon: Users, to: '/students' },
    { label: 'Topshiriqlar', icon: FileText, to: '/assignments' },
    { label: 'Kutubxona', icon: Library, to: '/library' },
    { label: 'E’lonlar', icon: Megaphone, to: '/announcements' },
    { label: 'Vakansiyalar', icon: Briefcase, to: '/vacancies' },
    { label: 'Blog', icon: Newspaper, to: '/blog' },
    { label: 'Shikoyatlar', icon: MessageSquareWarning, to: '/complaints' },
    { label: 'Support', icon: LifeBuoy, to: '/support' },
  ]
  const banners = buildBanners({ announcements, posts })

  return (
    <div className="space-y-5 pb-2">
      <Hero me={me} banners={banners} quickActions={quickActions} iconTiles={iconTiles} />
      <div className="space-y-5 px-4 lg:px-0">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat title="Jami talabalar" value={students.length.toLocaleString()} delta="+12%" icon={GraduationCap} />
          <Stat title="Jami o‘qituvchilar" value={teachers.length} delta="+3%" icon={BookOpen} />
          <Stat title="O‘rtacha davomat" value={`${avg}%`} delta="+2.1%" icon={TrendingUp} />
          <Stat title="Ochiq shikoyatlar" value={openC} delta="-4" negative icon={MessageSquareWarning} />
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="card p-5 lg:col-span-3">
            <h3 className="font-bold">Davomat dinamikasi</h3>
            <p className="text-sm text-muted">So‘nggi 7 kun</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={line}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="foiz" stroke="#147a36" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-bold">Davomat holati</h3>
            <div className="mt-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3}>
                    {pie.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm">
              {pie.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <i className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                    {p.name}
                  </span>
                  <b>{p.value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeacherHome() {
  const me = useCurrentUser()
  const users = useStore((s) => s.users)
  const groups = useStore((s) => s.groups)
  const attendance = useStore((s) => s.attendance)
  const assignments = useStore((s) => s.assignments)
  const announcements = useStore((s) => s.announcements)
  const posts = useStore((s) => s.posts)
  const myGroups = groups.filter((g) => me.groupIds?.includes(g.id))
  const myStudents = users.filter((u) => u.role === 'student' && me.groupIds?.includes(u.groupId))
  const myAsg = assignments.filter((a) => a.teacherId === me.id)

  const quickActions = [
    { label: 'Davomat', sub: 'Belgilash va tarix', icon: QrCode, to: '/attendance' },
    { label: 'Dars jadvali', sub: 'Guruh darslari', icon: CalendarDays, to: '/schedule' },
    { label: 'Topshiriqlar', sub: 'Baholash va nazorat', icon: FileText, to: '/assignments' },
    { label: 'Talabalarim', sub: 'Guruhlar ro‘yxati', icon: Users, to: '/students' },
  ]
  const iconTiles = [
    { label: 'E’lonlar', icon: Megaphone, to: '/announcements' },
    { label: 'Vakansiyalar', icon: Briefcase, to: '/vacancies' },
    { label: 'Blog', icon: Newspaper, to: '/blog' },
    { label: 'Support', icon: LifeBuoy, to: '/support' },
    { label: 'Bildirishnoma', icon: Bell, to: '/notifications' },
    { label: 'Sozlamalar', icon: Settings, to: '/settings' },
  ]
  const banners = buildBanners({ announcements, posts })

  return (
    <div className="space-y-5 pb-2">
      <Hero me={me} banners={banners} quickActions={quickActions} iconTiles={iconTiles} />
      <div className="space-y-4 px-4 lg:px-0">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat title="Guruhlarim" value={myGroups.length} icon={Shield} />
          <Stat title="Talabalarim" value={myStudents.length} icon={Users} />
          <Stat title="Faol topshiriqlar" value={myAsg.filter((a) => a.status === 'active').length} icon={FileText} />
        </div>
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 p-4 font-bold">Guruhlaringizdagi davomat</div>
          <ul className="divide-y divide-slate-100">
            {myStudents.slice(0, 8).map((s) => {
              const pct = calcPercentage(attendance.filter((a) => a.studentId === s.id))
              const tone = percentTone(pct)
              return (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={s.name} color={s.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted">{s.studentId}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone.bg} ${tone.text}`}>{pct}%</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StudentHome() {
  const me = useCurrentUser()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const announcements = useStore((s) => s.announcements)
  const posts = useStore((s) => s.posts)
  const vacancies = useStore((s) => s.vacancies)
  const attendance = useStore((s) => s.attendance)
  const schedule = useStore((s) => s.schedule)
  const groups = useStore((s) => s.groups)
  const users = useStore((s) => s.users)

  const banners = [
    ...announcements.slice(0, 2).map((a) => ({ to: `/announcements/${a.id}`, title: a.title, cover: a.cover })),
    ...vacancies.slice(0, 1).map((v) => ({ to: `/vacancies/${v.id}`, title: v.title, cover: 'career' })),
    ...posts.slice(0, 1).map((p) => ({ to: `/blog/${p.id}`, title: p.title, cover: p.cover })),
  ]

  const searchItems = [
    { label: 'Dars jadvali', to: '/schedule' },
    { label: 'Fanlar', to: '/subjects' },
    { label: 'Davomat', to: '/attendance' },
    { label: 'Topshiriqlar', to: '/assignments' },
    { label: 'Hujjatlar', to: '/documents' },
    { label: 'Kutubxona', to: '/library' },
    { label: 'E’lonlar', to: '/announcements' },
    { label: 'Vakansiyalar', to: '/vacancies' },
    { label: 'Blog', to: '/blog' },
    { label: 'Shikoyatlar', to: '/complaints' },
    { label: 'Support', to: '/support' },
    { label: 'Sozlamalar', to: '/settings' },
  ]
  const results = query.trim()
    ? searchItems.filter((it) => it.label.toLowerCase().includes(query.trim().toLowerCase()))
    : []

  const mine = attendance.filter((a) => a.studentId === me.id)
  const date = new Date().toISOString().slice(0, 10)
  const today = schedule.filter((s) => s.groupId === me.groupId && matchesDate(s, date))
  const group = groups.find((g) => g.id === me.groupId)

  return (
    <div className="-mx-4 lg:mx-0">
      <div
        className={`sticky top-0 z-40 bg-gradient-to-b from-[#0d5c28] via-[#147a36] to-[#4cbe6e] px-4 text-white ${
          compact
            ? 'rounded-b-[28px] pb-3.5 pt-[calc(0.45rem+env(safe-area-inset-top))] shadow-[0_10px_24px_rgba(13,92,40,0.28)]'
            : 'pb-8 pt-[calc(0.75rem+env(safe-area-inset-top))]'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate('/settings')} className="flex min-w-0 items-center gap-3 text-left">
            <div className="rounded-full ring-2 ring-white/70">
              <Avatar name={me?.name} color={me?.avatarColor || '#147a36'} size={compact ? 'sm' : 'md'} />
            </div>
            <div className="min-w-0">
              <p className={`truncate font-bold tracking-tight ${compact ? 'text-[18px]' : 'text-[20px]'}`}>{shortName(me?.name)}</p>
              {!compact && (
                <p className="truncate text-xs text-white/75">
                  {me.studentId} · {group?.name}
                </p>
              )}
            </div>
          </button>
          <QrBtn onClick={() => navigate('/attendance')} />
        </div>

        {!compact && <BannerStrip items={banners} onOpen={(to) => navigate(to)} />}

        <div className={`relative ${compact ? 'mt-3' : 'mt-4'}`}>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-slate-400 shadow-[0_8px_24px_rgba(16,80,40,0.08)]">
            <Search size={18} className="shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidiruv..."
              className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-slate-400"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-slate-300">
                <X size={16} />
              </button>
            )}
          </div>
          {results.length > 0 && (
            <div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
              {results.map((r) => (
                <button
                  key={r.to}
                  type="button"
                  onClick={() => {
                    setQuery('')
                    navigate(r.to)
                  }}
                  className="flex w-full px-4 py-3 text-left text-[16px] font-medium hover:bg-slate-50"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`relative bg-[#eef6f0] px-4 pb-4 ${compact ? 'pt-4' : '-mt-5 rounded-t-[28px] pt-4'}`}>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <QuickBlue label="Dars jadvali" sub="Kalendar va dars vaqtlari" onClick={() => navigate('/schedule')} />
          <QuickBlue light label="Ijtimoiy faollik" sub="Blog va yangiliklar" onClick={() => navigate('/blog')} />
          <QuickBlue label="Fanlar" sub="Guruh fanlari va materiallar" onClick={() => navigate('/subjects')} />
          <QuickBlue light label="Topshiriqlar" sub="Muddat va vazifalarni tekshirish" onClick={() => navigate('/assignments')} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <IconGridItem label="O‘zlashtirish" icon={LineChartIcon} onClick={() => navigate('/attendance')} />
          <IconGridItem label="Imtihonlar" icon={ClipboardList} onClick={() => navigate('/exams')} />
          <IconGridItem label="Road map" icon={GraduationCap} onClick={() => navigate('/subjects')} />
          <IconGridItem label="Imtihonlar jadvali" icon={CalendarDays} onClick={() => navigate('/exams')} />
          <IconGridItem label="Hujjatlar" icon={Folder} onClick={() => navigate('/documents')} />
          <IconGridItem label="Career Edu" icon={Briefcase} onClick={() => navigate('/vacancies')} />
          <IconGridItem label="Shartnoma Edu" icon={FileText} onClick={() => navigate('/assignments')} />
          <IconGridItem label="So‘rovnoma" icon={MessageSquareWarning} onClick={() => navigate('/complaints')} />
          <IconGridItem label="Support" icon={LifeBuoy} onClick={() => navigate('/support')} />
        </div>

        <div className="mt-4 card p-4">
          <h3 className="mb-3 font-bold">Bugungi darslar</h3>
          <ul className="space-y-3">
            {today.map((s) => {
              const rec = mine.find((a) => a.date === date && a.subject === s.subject)
              const teacher = users.find((u) => u.id === s.teacherId)
              return (
                <li key={s.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold">{s.subject}</p>
                    <p className="text-xs text-muted">
                      {s.start} – {s.end} · {teacher?.name}
                    </p>
                  </div>
                  {rec ? (
                    <Badge tone={rec.status === 'present' ? 'green' : rec.status === 'late' ? 'yellow' : 'red'}>
                      {STATUS[rec.status].label}
                    </Badge>
                  ) : (
                    <Badge>Kutilmoqda</Badge>
                  )}
                </li>
              )
            })}
            {!today.length && <p className="text-sm text-muted">Bugun dars yo‘q</p>}
          </ul>
        </div>
      </div>
    </div>
  )
}

function buildBanners({ announcements, posts }) {
  return [
    ...announcements.slice(0, 2).map((a) => ({ to: `/announcements/${a.id}`, title: a.title, cover: a.cover })),
    ...posts.slice(0, 1).map((p) => ({ to: `/blog/${p.id}`, title: p.title, cover: p.cover })),
  ]
}

function Hero({ me, subtitle, banners, quickActions, iconTiles }) {
  const navigate = useNavigate()
  const notifications = useStore((s) => s.notifications)
  const unread = notifications.filter((n) => n.userId === me?.id && !n.read).length
  const [query, setQuery] = useState('')

  const searchable = useMemo(() => {
    const nav = [{ label: 'Bildirishnomalar', icon: Bell, to: '/notifications' }, { label: 'Sozlamalar', icon: Settings, to: '/settings' }]
    const merged = [...quickActions, ...iconTiles, ...nav]
    const seen = new Set()
    return merged.filter((it) => (seen.has(it.to) ? false : (seen.add(it.to), true)))
  }, [quickActions, iconTiles])

  const results = query.trim()
    ? searchable.filter((it) => it.label.toLowerCase().includes(query.trim().toLowerCase()))
    : []

  const go = (to) => {
    setQuery('')
    navigate(to)
  }

  return (
    <div>
      <div className="relative rounded-b-[28px] bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 px-4 pb-6 pt-[calc(1rem+env(safe-area-inset-top))] text-white shadow-lg lg:rounded-2xl lg:pt-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[28px] lg:rounded-2xl">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute right-16 top-10 h-20 w-20 rounded-full bg-white/10" />
        </div>

        <div className="relative flex items-center justify-between gap-3">
          <button onClick={() => navigate('/settings')} className="flex min-w-0 items-center gap-3 text-left">
            <Avatar name={me?.name} color={me?.avatarColor} />
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold leading-tight">{me?.name}</p>
              <p className="truncate text-xs text-white/70">{subtitle || ROLE_LABEL[me?.role]}</p>
            </div>
          </button>
          <button onClick={() => navigate('/notifications')} className="relative shrink-0 rounded-2xl bg-white/15 p-2.5 backdrop-blur">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        </div>

        <BannerStrip items={banners} onOpen={(to) => go(to)} />

        <div className="relative mt-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-400 shadow-sm">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidiruv..."
              className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-slate-400"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-300 hover:text-slate-500">
                <X size={16} />
              </button>
            )}
          </div>
          {results.length > 0 && (
            <div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
              {results.map((r) => {
                const Icon = r.icon
                return (
                  <button
                    key={r.to}
                    onClick={() => go(r.to)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-slate-50"
                  >
                    <Icon size={16} className="text-brand-700" />
                    {r.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {quickActions.map((qa, i) => (
          <QuickAction key={qa.to} {...qa} alt={i % 2 === 1} onClick={() => navigate(qa.to)} />
        ))}
      </div>

      {iconTiles.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-3 px-4 pt-3">
          {iconTiles.map((it) => (
            <IconTile key={it.to} {...it} onClick={() => navigate(it.to)} />
          ))}
        </div>
      )}
    </div>
  )
}

function QuickAction({ label, sub, icon: Icon, alt, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-4 text-left text-white shadow-md transition active:scale-[0.98] ${
        alt ? 'bg-gradient-to-br from-brand-700 to-brand-500' : 'bg-gradient-to-br from-brand-900 to-brand-700'
      }`}
    >
      <div className="pointer-events-none absolute -right-4 -top-6 h-16 w-16 rounded-full bg-white/10" />
      <Icon size={20} className="relative" />
      <p className="relative mt-3 text-sm font-bold leading-tight">{label}</p>
      <p className="relative mt-0.5 text-[11px] text-white/75 leading-tight">{sub}</p>
    </button>
  )
}

function IconTile({ label, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} className="card flex flex-col items-center gap-2 px-2 py-4 text-center active:scale-[0.98]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-800">
        <Icon size={20} />
      </span>
      <span className="text-xs font-semibold leading-tight text-ink">{label}</span>
    </button>
  )
}

function Stat({ title, value, delta, icon: Icon, negative }) {
  return (
    <div className="card flex items-start justify-between p-4">
      <div>
        <p className="text-sm text-muted">{title}</p>
        <p className="mt-1 text-2xl font-extrabold">{value}</p>
        {delta && <p className={`mt-1 text-xs font-semibold ${negative ? 'text-rose-600' : 'text-emerald-600'}`}>{delta}</p>}
      </div>
      {Icon && (
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-800">
          <Icon size={18} />
        </div>
      )}
    </div>
  )
}

function weekLine(attendance) {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const rec = attendance.filter((a) => a.date === key)
    const foiz = rec.length ? calcPercentage(rec) : 80 + i
    return { name: d.toLocaleDateString('uz-UZ', { weekday: 'short' }), foiz }
  })
  return days
}

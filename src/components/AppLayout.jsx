import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LayoutGrid,
  Library,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Shield,
  Sparkles,
  Users,
  LifeBuoy,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCurrentUser, useStore } from '../store/useStore'
import { Avatar, cn } from './ui'
import { ROLE_LABEL } from '../lib/utils'

const ALL_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Asosiy', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/schedule', icon: CalendarDays, label: 'Dars jadvali', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/subjects', icon: BookOpen, label: 'Fanlar', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/exams', icon: ClipboardList, label: 'Imtihonlar', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/users', icon: Users, label: 'Foydalanuvchilar', roles: ['super_admin'] },
  { to: '/teachers', icon: GraduationCap, label: 'O‘qituvchilar', roles: ['super_admin'] },
  { to: '/students', icon: Users, label: 'Talabalar', roles: ['super_admin', 'teacher'] },
  { to: '/groups', icon: Shield, label: 'Guruhlar', roles: ['super_admin'] },
  { to: '/attendance', icon: ClipboardList, label: 'Davomat', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/assignments', icon: FileText, label: 'Topshiriqlar', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/library', icon: Library, label: 'Kutubxona', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/announcements', icon: Megaphone, label: 'E’lonlar', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/vacancies', icon: Briefcase, label: 'Vakansiyalar', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/blog', icon: Newspaper, label: 'Blog', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Shikoyatlar', roles: ['super_admin', 'student'] },
  { to: '/reports', icon: BookOpen, label: 'Hisobotlar', roles: ['super_admin'] },
  { to: '/support', icon: LifeBuoy, label: 'Support', roles: ['super_admin', 'teacher', 'student'] },
  { to: '/settings', icon: Settings, label: 'Sozlamalar', roles: ['super_admin', 'teacher', 'student'] },
]

const STUDENT_BOTTOM = [
  { to: '/', icon: Home, label: 'Asosiy' },
  { to: '/schedule', icon: CalendarDays, label: 'Dars jadvali' },
  { to: '/support', icon: Sparkles, label: 'Support', center: true },
  { to: '/subjects', icon: BookOpen, label: 'Fanlar' },
  { to: '/more', icon: LayoutGrid, label: 'Barchasi' },
]

const STAFF_BOTTOM = [
  { to: '/', icon: Home, label: 'Asosiy' },
  { to: '/attendance', icon: ClipboardList, label: 'Davomat' },
  { to: '/assignments', icon: FileText, label: 'Topshiriqlar' },
  { to: '/library', icon: Library, label: 'Kutubxona' },
  { to: '/more', icon: LayoutGrid, label: 'Barchasi' },
]

export default function AppLayout() {
  const me = useCurrentUser()
  const logout = useStore((s) => s.logout)
  const notifications = useStore((s) => s.notifications)
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isStudent = me?.role === 'student'

  const items = useMemo(() => ALL_ITEMS.filter((i) => i.roles.includes(me?.role)), [me?.role])
  const unread = notifications.filter((n) => n.userId === me?.id && !n.read).length
  const bottom = isStudent ? STUDENT_BOTTOM : STAFF_BOTTOM
  const isHome = location.pathname === '/'
  const ownBar =
    isStudent || (me?.role === 'teacher' && location.pathname === '/schedule')

  const NavList = ({ onClick }) => (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 scrollbar-thin">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClick}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#eef6f0] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-brand-800 text-white lg:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <img src="/logo-white.png" alt="" className="h-11 w-11 bg-transparent object-contain" />
          <div>
            <p className="text-lg font-extrabold tracking-tight">tizimsEdu.uz</p>
            <p className="text-xs text-white/60">Talaba kabineti</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="mx-3 mb-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-left"
        >
          <Avatar name={me?.name} color={me?.avatarColor} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{me?.name}</p>
            <p className="truncate text-xs text-white/60">{me?.email}</p>
          </div>
        </button>
        <NavList />
        <div className="p-3">
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            <LogOut size={16} />
            Chiqish
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-brand-800 text-white">
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2">
                <img src="/logo-white.png" alt="" className="h-9 w-9 bg-transparent object-contain" />
                <p className="text-lg font-extrabold">tizimsEdu.uz</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <div className="mx-3 mb-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <Avatar name={me?.name} color={me?.avatarColor} />
              <div>
                <p className="text-sm font-semibold">{me?.name}</p>
                <p className="text-xs text-white/60">{ROLE_LABEL[me?.role]}</p>
              </div>
            </div>
            <NavList onClick={() => setOpen(false)} />
            <div className="p-3">
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold"
              >
                <LogOut size={16} /> Chiqish
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="min-w-0">
        {!ownBar && (
          <header
            className={cn(
              'sticky top-0 z-30 items-center justify-between gap-3 bg-[#eef6f0]/90 px-4 py-3 backdrop-blur-md lg:flex lg:px-8',
              isHome ? 'hidden lg:flex' : 'flex',
            )}
          >
            <div className="flex items-center gap-3">
              <button className="rounded-xl p-2 hover:bg-white lg:hidden" onClick={() => setOpen(true)}>
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xs font-medium text-muted">{ROLE_LABEL[me?.role]}</p>
                <h1 className="text-base font-bold leading-tight lg:text-lg">
                  {location.pathname === '/' ? `Xush kelibsiz, ${me?.name?.split(' ')[0]}` : documentTitle(location.pathname)}
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="relative rounded-2xl bg-white p-2.5 shadow-sm"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>
          </header>
        )}

        <main
          className={cn(
            'safe-bottom',
            isStudent ? 'mx-auto w-full max-w-[430px] px-4 py-0' : cn('lg:px-8 lg:py-5', isHome ? 'px-4 py-0' : 'px-4 py-5'),
          )}
        >
          <Outlet context={{ onMenu: () => setOpen(true) }} />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white px-1 pb-[calc(0.35rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] lg:hidden">
        <div className="flex items-stretch justify-between">
          {bottom.map((item) => {
            const Icon = item.icon
            const active =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
            const center = item.center
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium"
              >
                <span
                  className={cn(
                    'grid place-items-center transition',
                    center
                      ? cn('h-8', active ? 'text-brand-800' : 'text-slate-400')
                      : cn('h-8 w-8 rounded-full', active ? 'bg-brand-800 text-white' : 'text-slate-400'),
                  )}
                >
                  <Icon size={center ? 22 : 18} strokeWidth={active ? 2.2 : 1.8} />
                </span>
                <span className={cn('leading-tight', active ? 'font-semibold text-brand-800' : 'text-slate-400')}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function documentTitle(path) {
  const map = {
    '/attendance': 'Davomat',
    '/schedule': 'Dars jadvali',
    '/exams': 'Imtihonlar',
    '/assignments': 'Topshiriqlar',
    '/library': 'Kutubxona',
    '/documents': 'Barcha hujjatlar',
    '/announcements': 'E’lonlar',
    '/vacancies': 'Vakansiyalar',
    '/blog': 'Blog',
    '/complaints': 'Shikoyatlar',
    '/support': 'Support',
    '/users': 'Foydalanuvchilar',
    '/teachers': 'O‘qituvchilar',
    '/students': 'Talabalar',
    '/groups': 'Guruhlar',
    '/reports': 'Hisobotlar',
    '/settings': 'Sozlamalar',
    '/notifications': 'Bildirishnomalar',
    '/more': 'Barchasi',
  }
  const hit = Object.keys(map).find((k) => path === k || (k !== '/' && path.startsWith(k)))
  return map[hit] || 'tizimsEdu.uz'
}

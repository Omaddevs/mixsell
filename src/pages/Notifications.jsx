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
  LogOut,
  Megaphone,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { useCurrentUser, useStore } from '../store/useStore'
import { timeAgo } from '../lib/utils'
import { MenuCard, PageBar } from '../components/HemisUI'
import { EmptyState, RoleScreen } from '../components/StudentChrome'

export default function Notifications() {
  const me = useCurrentUser()
  const notifications = useStore((s) => s.notifications)
  const markNotifRead = useStore((s) => s.markNotifRead)
  const markAllRead = useStore((s) => s.markAllRead)
  const mine = notifications.filter((n) => n.userId === me.id)

  return (
    <RoleScreen title="Bildirishnomalar">
      <button className="mb-3 text-sm font-semibold text-brand-800" onClick={() => markAllRead(me.id)}>
        Barchasini o‘qilgan qilish
      </button>
      <div className="space-y-2.5">
      {mine.map((n) => (
        <button
          key={n.id}
          onClick={() => markNotifRead(n.id)}
          className={`w-full rounded-[20px] bg-white p-4 text-left shadow-[0_2px_12px_rgba(16,80,40,0.05)] ${n.read ? 'opacity-70' : 'ring-1 ring-brand-100'}`}
        >
          <p className="font-semibold">{n.title}</p>
          <p className="text-sm text-muted">{n.body}</p>
          <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
        </button>
      ))}
      {!mine.length && <EmptyState text="Bildirishnoma yo‘q." />}
      </div>
    </RoleScreen>
  )
}

export function More() {
  const navigate = useNavigate()
  const me = useCurrentUser()
  const logout = useStore((s) => s.logout)
  const student = me.role === 'student'

  const items = [
    { to: '/attendance', label: 'Davomat', icon: ClipboardList },
    { to: '/schedule', label: 'Dars jadvali', icon: CalendarDays },
    { to: '/subjects', label: 'Fanlar', icon: BookOpen },
    { to: '/exams', label: 'Imtihonlar', icon: ClipboardList },
    { to: '/assignments', label: 'Topshiriqlar', icon: FileText },
    { to: '/library', label: 'Kutubxona', icon: Library },
    { to: '/documents', label: 'Barcha hujjatlar', icon: Folder },
    { to: '/announcements', label: 'E’lonlar', icon: Megaphone },
    { to: '/vacancies', label: 'Vakansiyalar', icon: Briefcase },
    { to: '/blog', label: 'Blog', icon: Newspaper },
    me.role !== 'teacher' ? { to: '/complaints', label: 'Shikoyatlar', icon: MessageSquareWarning } : null,
    { to: '/support', label: 'Support', icon: LifeBuoy },
    { to: '/notifications', label: 'Bildirishnomalar', icon: Bell },
    { to: '/settings', label: 'Sozlamalar', icon: Settings },
    me.role === 'super_admin' ? { to: '/users', label: 'Foydalanuvchilar', icon: Users } : null,
    me.role === 'super_admin' ? { to: '/teachers', label: 'O‘qituvchilar', icon: GraduationCap } : null,
    me.role === 'teacher' || me.role === 'super_admin' ? { to: '/students', label: 'Talabalar', icon: Users } : null,
    me.role === 'super_admin' ? { to: '/groups', label: 'Guruhlar', icon: Shield } : null,
    me.role === 'super_admin' ? { to: '/reports', label: 'Hisobotlar', icon: BookOpen } : null,
  ].filter(Boolean)

  return (
    <div className={student ? '-mx-4' : ''}>
      {student && (
        <PageBar
          variant="blue"
          title="Barchasi"
          right={
            <button
              type="button"
              className="p-2 text-white"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              aria-label="Chiqish"
            >
              <LogOut size={18} />
            </button>
          }
        />
      )}
      <div className={`grid grid-cols-2 gap-3 ${student ? 'px-4 pb-4' : ''}`}>
        {items.map((it) => (
          <MenuCard key={it.to + it.label} label={it.label} icon={it.icon} onClick={() => navigate(it.to)} />
        ))}
      </div>
    </div>
  )
}

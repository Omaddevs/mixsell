import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../store/useStore'
import { cn } from './ui'

export function RoleScreen({ title, back = '/', right, children, className }) {
  const me = useCurrentUser()
  if (me?.role !== 'student') return children
  return (
    <Screen title={title} back={back} right={right} className={className}>
      {children}
    </Screen>
  )
}

export function Screen({ title, back = '/', right, children, className }) {
  const navigate = useNavigate()
  return (
    <div className={cn('-mx-4 min-h-[70vh] bg-[#eef6f0] lg:mx-0 lg:rounded-[28px]', className)}>
      <header className="relative flex items-center justify-center px-2 py-3">
        <button
          type="button"
          onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
          className="absolute left-2 grid h-10 w-10 place-items-center rounded-full text-ink"
          aria-label="Orqaga"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="max-w-[72%] truncate text-center text-[17px] font-semibold">{title}</h1>
        {right && <div className="absolute right-2">{right}</div>}
      </header>
      <div className="px-4 pb-8">{children}</div>
    </div>
  )
}

export function SoftCard({ children, className, onClick }) {
  const cls = cn(
    'w-full rounded-[20px] bg-white p-4 text-left shadow-[0_2px_12px_rgba(16,80,40,0.05)]',
    onClick && 'active:scale-[0.99]',
    className,
  )
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    )
  }
  return <div className={cls}>{children}</div>
}

export function SoftRow({ icon: Icon, title, sub, extra, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[20px] bg-white px-3 py-3 text-left shadow-[0_2px_12px_rgba(16,80,40,0.05)]"
    >
      {Icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-brand-50 text-brand-700">
          <Icon size={20} strokeWidth={1.8} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-snug text-ink">{title}</span>
        {sub && <span className="mt-0.5 block text-[12px] leading-snug text-muted">{sub}</span>}
      </span>
      {extra}
      <span className="shrink-0 text-lg text-slate-300">›</span>
    </button>
  )
}

export function EmptyState({ text = 'Ma’lumot topilmadi' }) {
  return <p className="px-2 py-12 text-center text-sm text-muted">{text}</p>
}

export function StatusChip({ children, tone = 'blue' }) {
  const map = {
    blue: 'bg-brand-50 text-brand-800',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-600',
  }
  return <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', map[tone] || map.blue)}>{children}</span>
}

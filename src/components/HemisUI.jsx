import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, LogOut, Menu, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Cover, cn } from './ui'

export function shortName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'Talaba'
  if (parts.length === 1) return parts[0]
  return `${parts[0][0]}.${parts[parts.length - 1]}`
}

export function PageBar({ title, back, right, variant = 'light', onMenu }) {
  const navigate = useNavigate()
  const dark = variant === 'blue'
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between gap-3 px-3 py-3 lg:rounded-t-2xl',
        dark ? 'bg-brand-800 text-white' : 'bg-[#eef6f0] text-ink',
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        {back ? (
          <button
            type="button"
            onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
            className={cn('rounded-full p-2', dark ? 'hover:bg-white/10' : 'hover:bg-white')}
            aria-label="Orqaga"
          >
            <ChevronLeft size={22} />
          </button>
        ) : onMenu ? (
          <button
            type="button"
            onClick={onMenu}
            className={cn('rounded-full p-2 lg:invisible', dark ? 'hover:bg-white/10' : 'hover:bg-white')}
            aria-label="Menyu"
          >
            <Menu size={20} />
          </button>
        ) : (
          <span className="w-9" />
        )}
        <h1 className="truncate text-[17px] font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-1">{right}</div>
    </header>
  )
}

export function LogoutBtn({ dark }) {
  return (
    <span className={cn('grid h-9 w-9 place-items-center rounded-full', dark ? 'text-white' : 'text-brand-800')}>
      <LogOut size={18} />
    </span>
  )
}

export function QrBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-white"
      aria-label="QR kod"
    >
      <QrCode size={22} />
    </button>
  )
}

export function BannerCard({ title, type, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[104px] w-[148px] shrink-0 snap-start overflow-hidden rounded-[16px] text-left shadow-[0_8px_18px_rgba(13,92,40,0.22)]"
    >
      <Cover type={type} title={title} variant="banner" />
    </button>
  )
}

export function BannerStrip({ items = [], onOpen }) {
  const scroller = useRef(null)
  const [thumb, setThumb] = useState({ width: 40, left: 0, show: false })

  const sync = () => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const ratio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1
    const width = Math.min(72, Math.max(28, ratio * 100))
    const left = max <= 0 ? 0 : (el.scrollLeft / max) * (100 - width)
    setThumb({ width, left, show: max > 12 })
  }

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [items.length])

  const nudge = (dir) => {
    scroller.current?.scrollBy({ left: dir * 164, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <div className="mt-4">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-0.5"
      >
        {items.map((b, i) => (
          <BannerCard key={b.to || i} title={b.title} type={b.cover} onClick={() => onOpen?.(b.to)} />
        ))}
      </div>
      {thumb.show && (
        <div className="mt-2.5 flex h-[22px] items-center rounded-full bg-white/18 px-0.5">
          <button
            type="button"
            onClick={() => nudge(-1)}
            className="grid h-[22px] w-8 shrink-0 place-items-center text-white/95"
            aria-label="Oldingi banner"
          >
            <ChevronLeft size={16} strokeWidth={2.4} />
          </button>
          <div className="relative mx-0.5 h-[7px] flex-1 rounded-full bg-white/25">
            <span
              className="absolute top-1/2 h-[7px] -translate-y-1/2 rounded-full bg-[#4b5563]"
              style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => nudge(1)}
            className="grid h-[22px] w-8 shrink-0 place-items-center text-white/95"
            aria-label="Keyingi banner"
          >
            <ChevronRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </div>
  )
}

export function MenuCard({ label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[76px] items-center justify-between rounded-[22px] bg-white px-4 py-3 text-left shadow-[0_4px_18px_rgba(16,80,40,0.06)] active:scale-[0.99]"
    >
      <span className="pr-2 text-[15px] font-medium leading-snug text-ink">{label}</span>
      <Icon size={22} className="shrink-0 text-brand-700" strokeWidth={1.8} />
    </button>
  )
}

export function IconGridItem({ label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[108px] flex-col items-center justify-center gap-2.5 rounded-[22px] bg-white px-2 py-4 text-center shadow-[0_4px_18px_rgba(16,80,40,0.06)] active:scale-[0.98]"
    >
      <Icon size={26} className="text-brand-700" strokeWidth={1.7} />
      <span className="line-clamp-2 text-[12px] font-medium leading-tight text-ink">{label}</span>
    </button>
  )
}

export function QuickBlue({ label, sub, onClick, light }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[96px] flex-col justify-between rounded-[20px] px-3.5 py-3 text-left text-white shadow-[0_8px_20px_rgba(20,122,54,0.28)] active:scale-[0.98]',
        light
          ? 'bg-gradient-to-br from-[#4cbe6e] to-[#1a9440]'
          : 'bg-gradient-to-br from-[#22a84a] to-[#147a36]',
      )}
    >
      <p className="line-clamp-2 text-[14px] font-semibold leading-tight">{label}</p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/85">{sub}</p>
    </button>
  )
}

export function ScorePill({ value, max, tone }) {
  const map = {
    green: 'border-emerald-400 text-emerald-600',
    amber: 'border-amber-400 text-amber-600',
    blue: 'border-sky-400 text-sky-600',
    slate: 'border-slate-300 text-slate-500',
  }
  return (
    <span className={cn('inline-flex min-w-[58px] items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', map[tone] || map.blue)}>
      {value} / {max}
    </span>
  )
}

export function EmptyInbox({ title = 'Ma’lumot topilmadi' }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative">
        <div className="grid h-28 w-36 place-items-center rounded-2xl bg-slate-200/80">
          <div className="h-20 w-24 rounded-lg bg-white shadow-inner">
            <div className="mx-auto mt-3 h-10 w-16 rounded bg-slate-100" />
            <div className="mx-4 mt-3 space-y-1.5">
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="absolute -right-4 -top-3 rounded-2xl bg-slate-100 px-2 py-1 text-slate-400 shadow-sm">△ □ ○</div>
      </div>
      <p className="mt-6 text-sm text-muted">{title}</p>
    </div>
  )
}

export function ListRow({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[22px] bg-white px-3 py-3 text-left shadow-[0_4px_18px_rgba(16,80,40,0.06)]"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="flex-1 text-[15px] font-medium leading-snug">{label}</span>
      <span className="text-lg text-slate-300">›</span>
    </button>
  )
}

export function SemesterCard({ title, dates, open, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_4px_18px_rgba(16,80,40,0.06)]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
        <p className="text-[15px] font-semibold">
          {title} <span className="font-normal text-muted">({dates})</span>
        </p>
        <span className={cn('text-slate-400 transition', open && 'rotate-90')}>›</span>
      </button>
      {open && children}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Bell, CalendarX, ChevronLeft, ChevronRight, Menu, Pencil, Plus, Trash2 } from 'lucide-react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useCurrentUser, useStore } from '../store/useStore'
import { Field, inputClass, Modal, PrimaryBtn, cn } from '../components/ui'
import {
  WEEKDAYS,
  MONTHS_UZ,
  calendarCells,
  formatUzFull,
  isoDate,
  matchesDate,
  parseISO,
} from '../lib/schedule'

export default function SchedulePage() {
  const me = useCurrentUser()
  if (me.role === 'super_admin') return <AdminSchedule />
  return <ScheduleCalendar />
}

function visibleLessons(schedule, me, date) {
  return schedule.filter((s) => {
    if (!matchesDate(s, date)) return false
    if (me.role === 'student') return s.groupId === me.groupId
    if (me.role === 'teacher') return s.teacherId === me.id
    return true
  })
}

function ScheduleCalendar() {
  const me = useCurrentUser()
  const schedule = useStore((s) => s.schedule)
  const users = useStore((s) => s.users)
  const groups = useStore((s) => s.groups)
  const notifications = useStore((s) => s.notifications)
  const navigate = useNavigate()
  const ctx = useOutletContext() || {}
  const unread = notifications.filter((n) => n.userId === me.id && !n.read).length

  const today = new Date()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(() => isoDate(today))
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const cells = useMemo(() => calendarCells(year, month), [year, month])
  const selectedDate = parseISO(selected)
  const todayIso = isoDate(today)
  const dayLessons = visibleLessons(schedule, me, selectedDate).sort((a, b) => a.start.localeCompare(b.start))

  const shiftMonth = (dir) => {
    const next = new Date(year, month + dir, 1)
    setCursor(next)
    const keep = parseISO(selected)
    if (keep.getMonth() !== next.getMonth() || keep.getFullYear() !== next.getFullYear()) {
      setSelected(isoDate(new Date(next.getFullYear(), next.getMonth(), 1)))
    }
  }

  const shiftYear = (dir) => {
    const next = new Date(year + dir, month, 1)
    setCursor(next)
    setSelected(isoDate(new Date(next.getFullYear(), next.getMonth(), Math.min(selectedDate.getDate(), 28))))
  }

  const pickDay = (c) => {
    setSelected(c.iso)
    if (!c.inMonth) setCursor(new Date(c.date.getFullYear(), c.date.getMonth(), 1))
  }

  return (
    <div className="-mx-4 mx-auto min-h-[70vh] w-full max-w-[430px] overflow-hidden bg-[#eef6f0] lg:rounded-[28px]">
      <div className="rounded-b-[36px] bg-gradient-to-b from-[#0d5c28] via-[#1a9440] to-[#5dcc78] px-4 pb-6 pt-[calc(0.65rem+env(safe-area-inset-top))] text-white shadow-[0_12px_28px_rgba(13,92,40,0.28)]">
        <div className="flex items-center justify-between">
          <button type="button" className="grid h-10 w-10 place-items-center rounded-[14px] hover:bg-white/10 lg:invisible" onClick={ctx.onMenu} aria-label="Menyu">
            <Menu size={20} />
          </button>
          <h1 className="text-[17px] font-semibold tracking-tight">Dars jadvali</h1>
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-white text-brand-800 shadow-sm"
            aria-label="Bildirishnoma"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <button type="button" onClick={() => shiftYear(-1)} className="grid h-9 w-9 place-items-center rounded-[12px] bg-white/12 text-lg leading-none hover:bg-white/20" aria-label="Oldingi yil">
            ‹‹
          </button>
          <p className="min-w-[4.5rem] text-center text-[15px] font-semibold tabular-nums">{year}-yil</p>
          <button type="button" onClick={() => shiftYear(1)} className="grid h-9 w-9 place-items-center rounded-[12px] bg-white/12 text-lg leading-none hover:bg-white/20" aria-label="Keyingi yil">
            ››
          </button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-5">
          <button type="button" onClick={() => shiftMonth(-1)} className="grid h-9 w-9 place-items-center rounded-[12px] bg-white/12 hover:bg-white/20" aria-label="Oldingi oy">
            <ChevronLeft size={20} />
          </button>
          <p className="min-w-[9rem] text-center text-[18px] font-semibold">{MONTHS_UZ[month]}</p>
          <button type="button" onClick={() => shiftMonth(1)} className="grid h-9 w-9 place-items-center rounded-[12px] bg-white/12 hover:bg-white/20" aria-label="Keyingi oy">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-4 rounded-[22px] bg-white/10 px-2 py-3">
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wide text-white/75">
            {WEEKDAYS.map((d) => (
              <span key={d.id} className="py-1">
                {d.short}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-y-1.5 text-center text-[15px]">
            {cells.map((c) => {
              const isSel = c.iso === selected
              const isToday = c.iso === todayIso
              return (
                <button
                  key={c.iso}
                  type="button"
                  onClick={() => pickDay(c)}
                  className={cn(
                    'mx-auto grid h-10 w-10 place-items-center rounded-[12px] font-medium transition',
                    !c.inMonth && 'text-white/30',
                    c.inMonth && !isSel && 'text-white',
                    isToday && !isSel && 'ring-1 ring-white/70',
                    isSel && 'bg-white font-bold text-brand-800 shadow-md',
                  )}
                >
                  {c.day}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 rounded-[16px] bg-white/16 px-4 py-2.5 text-center">
          <p className="text-[13px] font-medium leading-snug text-white">{formatUzFull(selectedDate)}</p>
        </div>
      </div>

      <div className="px-4 pb-8 pt-5">
        {dayLessons.length === 0 ? (
          <div className="flex flex-col items-center rounded-[24px] bg-white px-5 py-10 text-center shadow-[0_4px_18px_rgba(16,80,40,0.06)]">
            <div className="grid h-14 w-14 place-items-center rounded-[16px] bg-slate-100 text-slate-400">
              <CalendarX size={28} strokeWidth={1.6} />
            </div>
            <p className="mt-3 text-[15px] font-semibold text-ink">{formatUzFull(selectedDate)}</p>
            <p className="mt-1 text-sm text-muted">Ushbu kun uchun darslar topilmadi</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {dayLessons.map((s) => {
              const teacher = users.find((u) => u.id === s.teacherId)
              const group = groups.find((g) => g.id === s.groupId)
              return (
                <li key={s.id} className="flex gap-3 rounded-[22px] bg-white p-4 shadow-[0_4px_18px_rgba(16,80,40,0.06)]">
                  <div className="rounded-[16px] bg-brand-50 px-3 py-2 text-center text-brand-800">
                    <p className="text-xs font-bold">{s.start}</p>
                    <p className="text-[10px] text-muted">{s.end}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{s.subject}</p>
                    <p className="text-sm text-muted">
                      {teacher?.name} · {group?.name}
                      {s.room ? ` · ${s.room}` : ''}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

const emptyForm = {
  groupId: '',
  teacherId: '',
  subject: '',
  start: '08:30',
  end: '10:00',
  weekday: 1,
  room: '',
  date: '',
}

function AdminSchedule() {
  const schedule = useStore((s) => s.schedule)
  const groups = useStore((s) => s.groups)
  const users = useStore((s) => s.users)
  const addSchedule = useStore((s) => s.addSchedule)
  const updateSchedule = useStore((s) => s.updateSchedule)
  const removeSchedule = useStore((s) => s.removeSchedule)
  const teachers = users.filter((u) => u.role === 'teacher')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [groupFilter, setGroupFilter] = useState('all')

  const rows = schedule.filter((s) => groupFilter === 'all' || s.groupId === groupFilter)

  const startEdit = (item) => {
    setEditing(item.id)
    setForm({
      groupId: item.groupId,
      teacherId: item.teacherId,
      subject: item.subject,
      start: item.start,
      end: item.end,
      weekday: item.weekday || 1,
      room: item.room || '',
      date: item.date || '',
    })
    setOpen(true)
  }

  const startCreate = () => {
    setEditing(null)
    setForm({
      ...emptyForm,
      groupId: groups[0]?.id || '',
      teacherId: teachers[0]?.id || '',
    })
    setOpen(true)
  }

  const save = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      weekday: form.date ? undefined : Number(form.weekday),
      date: form.date || '',
    }
    if (editing) updateSchedule(editing, payload)
    else addSchedule(payload)
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Dars jadvallari</h2>
          <p className="text-sm text-muted">Guruh, fan, o‘qituvchi, kun va vaqtni kiriting. Talaba kalendarida shu ma’lumot chiqadi.</p>
        </div>
        <PrimaryBtn className="py-2" onClick={startCreate}>
          <Plus size={16} /> Yangi dars
        </PrimaryBtn>
      </div>

      <select className={inputClass + ' max-w-xs'} value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
        <option value="all">Barcha guruhlar</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 border-b border-slate-100 px-4 py-2 text-xs font-semibold text-muted sm:grid">
          <span>Fan / guruh</span>
          <span>O‘qituvchi</span>
          <span>Vaqt</span>
          <span>Kun</span>
          <span />
        </div>
        {rows.map((s) => {
          const teacher = users.find((u) => u.id === s.teacherId)
          const group = groups.find((g) => g.id === s.groupId)
          const day = s.date ? s.date : WEEKDAYS.find((w) => w.id === (s.weekday || 1))?.label
          return (
            <div key={s.id} className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 last:border-0 sm:grid sm:grid-cols-[1fr_1fr_1fr_auto_auto] sm:items-center">
              <div>
                <p className="font-semibold">{s.subject}</p>
                <p className="text-xs text-muted">{group?.name}</p>
              </div>
              <p className="text-sm">{teacher?.name}</p>
              <p className="text-sm">
                {s.start} – {s.end}
                {s.room ? ` · ${s.room}` : ''}
              </p>
              <p className="text-sm text-muted">{day}</p>
              <div className="flex gap-1">
                <button type="button" className="rounded-xl p-2 text-brand-800 hover:bg-brand-50" onClick={() => startEdit(s)}>
                  <Pencil size={16} />
                </button>
                <button type="button" className="rounded-xl p-2 text-rose-600 hover:bg-rose-50" onClick={() => removeSchedule(s.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
        {!rows.length && <p className="px-4 py-6 text-sm text-muted">Hali dars qo‘shilmagan.</p>}
      </div>

      <Modal open={open} title={editing ? 'Darsni tahrirlash' : 'Yangi dars'} onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={save}>
          <Field label="Guruh">
            <select className={inputClass} required value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="O‘qituvchi">
            <select className={inputClass} required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fan">
            <input className={inputClass} required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Boshlanish">
              <input className={inputClass} type="time" required value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            </Field>
            <Field label="Tugash">
              <input className={inputClass} type="time" required value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            </Field>
          </div>
          <Field label="Xona">
            <input className={inputClass} value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="A-204" />
          </Field>
          <Field label="Hafta kuni (takrorlanuvchi)">
            <select
              className={inputClass}
              value={form.weekday}
              disabled={!!form.date}
              onChange={(e) => setForm({ ...form, weekday: Number(e.target.value) })}
            >
              {WEEKDAYS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Yoki aniq sana (ixtiyoriy)">
            <input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <PrimaryBtn type="submit" className="w-full">
            Saqlash
          </PrimaryBtn>
        </form>
      </Modal>
    </div>
  )
}

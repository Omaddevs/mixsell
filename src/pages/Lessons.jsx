import { BookOpen, CalendarDays, ClipboardList, UserRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCurrentUser, useStore } from '../store/useStore'
import { calcPercentage } from '../lib/attendance'
import { WEEKDAYS } from '../lib/schedule'
import { EmptyState, RoleScreen, SoftCard, SoftRow, StatusChip } from '../components/StudentChrome'

export function SubjectsPage() {
  const me = useCurrentUser()
  const navigate = useNavigate()
  const schedule = useStore((s) => s.schedule)
  const users = useStore((s) => s.users)

  const rows = (
    me.role === 'student' ? schedule.filter((s) => s.groupId === me.groupId) : schedule
  ).filter((s, i, arr) => arr.findIndex((x) => x.subject === s.subject) === i)

  return (
    <RoleScreen title="Fanlar">
      <div className="space-y-2.5">
        {rows.map((s) => {
          const teacher = users.find((u) => u.id === s.teacherId)
          return (
            <SoftRow
              key={s.subject}
              icon={BookOpen}
              title={s.subject}
              sub={teacher?.name}
              onClick={() => navigate(`/subjects/${encodeURIComponent(s.subject)}`)}
            />
          )
        })}
        {!rows.length && <EmptyState text="Fanlar topilmadi." />}
      </div>
    </RoleScreen>
  )
}

export function SubjectDetail() {
  const { name } = useParams()
  const subject = decodeURIComponent(name || '')
  const me = useCurrentUser()
  const navigate = useNavigate()
  const schedule = useStore((s) => s.schedule)
  const users = useStore((s) => s.users)
  const books = useStore((s) => s.books)
  const assignments = useStore((s) => s.assignments)
  const attendance = useStore((s) => s.attendance)

  const slots = schedule.filter((s) => s.subject === subject && (me.role !== 'student' || s.groupId === me.groupId))
  const teacher = users.find((u) => u.id === slots[0]?.teacherId)
  const relatedBooks = books.filter((b) => b.title.toLowerCase().includes(subject.split(' ')[0].toLowerCase()))
  const relatedAsg = assignments.filter((a) => a.title.toLowerCase().includes(subject.split(' ')[0].toLowerCase()) && (me.role !== 'student' || a.groupId === me.groupId))
  const recs = attendance.filter((a) => a.studentId === me.id && a.subject === subject)
  const pct = recs.length ? calcPercentage(recs) : null

  return (
    <RoleScreen title={subject} back="/subjects">
      <div className="space-y-3">
        <SoftCard>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-brand-50 text-brand-700">
              <UserRound size={22} />
            </span>
            <div>
              <p className="text-[13px] text-muted">O‘qituvchi</p>
              <p className="font-semibold">{teacher?.name || '—'}</p>
            </div>
            {pct !== null && <StatusChip className="ml-auto">{pct}% davomat</StatusChip>}
          </div>
        </SoftCard>

        <p className="px-1 text-[13px] font-semibold text-muted">Dars vaqtlari</p>
        {slots.map((s) => (
          <SoftCard key={s.id}>
            <div className="flex items-center gap-3">
              <CalendarDays className="text-brand-700" size={18} />
              <div>
                <p className="font-medium">{WEEKDAYS.find((w) => w.id === (s.weekday || 1))?.label}</p>
                <p className="text-[13px] text-muted">
                  {s.start} – {s.end}
                  {s.room ? ` · ${s.room}` : ''}
                </p>
              </div>
            </div>
          </SoftCard>
        ))}
        {!slots.length && <EmptyState text="Jadval kiritilmagan." />}

        {relatedAsg.length > 0 && (
          <>
            <p className="px-1 pt-1 text-[13px] font-semibold text-muted">Topshiriqlar</p>
            {relatedAsg.map((a) => (
              <SoftRow
                key={a.id}
                icon={ClipboardList}
                title={a.title}
                sub={`Muddat ${a.deadline}`}
                onClick={() => navigate(`/assignments/${a.id}`)}
              />
            ))}
          </>
        )}

        {relatedBooks.length > 0 && (
          <>
            <p className="px-1 pt-1 text-[13px] font-semibold text-muted">O‘quv materiallari</p>
            {relatedBooks.map((b) => (
              <SoftRow key={b.id} icon={BookOpen} title={b.title} sub={b.author} onClick={() => navigate(`/library/${b.id}`)} />
            ))}
          </>
        )}
      </div>
    </RoleScreen>
  )
}

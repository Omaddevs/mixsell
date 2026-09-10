import { useMemo, useState } from 'react'
import { Download, Minus, Plus, Search } from 'lucide-react'
import { useCurrentUser, useStore } from '../store/useStore'
import { calcPercentage, percentTone, STATUS, summarize } from '../lib/attendance'
import { exportAttendanceExcel } from '../lib/excel'
import { Avatar, Badge, Field, inputClass, Modal, PrimaryBtn } from '../components/ui'
import { EmptyState, RoleScreen, SoftCard, StatusChip } from '../components/StudentChrome'

export default function Attendance() {
  const me = useCurrentUser()
  const users = useStore((s) => s.users)
  const groups = useStore((s) => s.groups)
  const attendance = useStore((s) => s.attendance)
  const schedule = useStore((s) => s.schedule)
  const markAttendance = useStore((s) => s.markAttendance)

  const teacherGroups = me.role === 'teacher' ? groups.filter((g) => me.groupIds?.includes(g.id)) : groups
  const [groupId, setGroupId] = useState(teacherGroups[0]?.id || groups[0]?.id)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [q, setQ] = useState('')
  const [subject, setSubject] = useState(
    schedule.find((s) => s.groupId === (teacherGroups[0]?.id || groups[0]?.id))?.subject || 'Dars',
  )
  const [comments, setComments] = useState({})
  const [exportOpen, setExportOpen] = useState(false)
  const [period, setPeriod] = useState('week')
  const [oneStudent, setOneStudent] = useState('')

  const subjects = schedule.filter((s) => s.groupId === groupId)
  const students = users.filter((u) => u.role === 'student' && u.groupId === groupId && u.name.toLowerCase().includes(q.toLowerCase()))

  const dayRecs = attendance.filter((a) => a.groupId === groupId && a.date === date && (!subject || a.subject === subject))
  const sum = summarize(dayRecs)

  const canEdit = me.role === 'teacher' || me.role === 'super_admin'
  const studentView = me.role === 'student'

  const myRecs = useMemo(() => attendance.filter((a) => a.studentId === me.id).sort((a, b) => b.date.localeCompare(a.date)), [attendance, me.id])

  if (studentView) {
    const pct = calcPercentage(myRecs)
    const tone = percentTone(pct)
    const chipTone = tone.tone === 'green' ? 'green' : tone.tone === 'yellow' ? 'amber' : 'red'
    return (
      <RoleScreen title="O‘zlashtirish">
        <SoftCard className={tone.bg}>
          <p className="text-[13px] text-muted">Sizning davomatingiz</p>
          <div className="mt-1 flex items-end justify-between">
            <p className={`text-4xl font-extrabold ${tone.text}`}>{pct}%</p>
            <StatusChip tone={chipTone}>{tone.tone === 'green' ? 'Yaxshi' : tone.tone === 'yellow' ? 'Ogohlantirish' : 'Past'}</StatusChip>
          </div>
        </SoftCard>
        <div className="mt-3 space-y-2.5">
          {myRecs.map((r) => (
            <SoftCard key={r.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.subject}</p>
                  <p className="text-[12px] text-muted">
                    {r.date} {r.time && `· ${r.time}`} {r.comment && `· ${r.comment}`}
                  </p>
                </div>
                <StatusChip tone={r.status === 'present' ? 'green' : r.status === 'late' ? 'amber' : 'red'}>{STATUS[r.status].label}</StatusChip>
              </div>
            </SoftCard>
          ))}
          {!myRecs.length && <EmptyState text="Davomat yozuvi hali yo‘q." />}
        </div>
      </RoleScreen>
    )
  }

  const mark = (student, status) => {
    const comment = comments[student.id] || ''
    if (status === 'late' && !comment.trim()) return
    markAttendance({
      studentId: student.id,
      groupId,
      status,
      comment: status === 'late' ? comment : '',
      subject,
      date,
    })
  }

  const onPlus = (student) => {
    const comment = (comments[student.id] || '').trim()
    mark(student, comment ? 'late' : 'present')
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Guruh">
          <select
            className={inputClass}
            value={groupId}
            onChange={(e) => {
              setGroupId(e.target.value)
              const next = schedule.find((s) => s.groupId === e.target.value)
              if (next) setSubject(next.subject)
            }}
          >
            {teacherGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sana">
          <input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Fan">
          <select className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.length ? (
              subjects.map((s) => (
                <option key={s.id} value={s.subject}>
                  {s.subject}
                </option>
              ))
            ) : (
              <option>Dars</option>
            )}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Mini n={sum.present} label="Kelgan" tone="green" />
        <Mini n={sum.late} label="Kechikkan" tone="yellow" />
        <Mini n={sum.absent} label="Kelmadi" tone="red" />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input className={`${inputClass} pl-9`} placeholder="Talaba qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        {students.map((s) => {
          const rec = dayRecs.find((r) => r.studentId === s.id)
          const pct = calcPercentage(attendance.filter((a) => a.studentId === s.id))
          const tone = percentTone(pct)
          return (
            <div key={s.id} className="border-b border-slate-100 p-4 last:border-0">
              <div className="flex items-start gap-3">
                <Avatar name={s.name} color={s.avatarColor} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{s.name}</p>
                    <span className="text-xs text-muted">{s.studentId}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tone.bg} ${tone.text}`}>{pct}%</span>
                    {rec && (
                      <Badge tone={rec.status === 'present' ? 'green' : rec.status === 'late' ? 'yellow' : 'red'}>
                        {STATUS[rec.status].label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    {rec?.time || '—'} {rec?.comment ? `· ${rec.comment}` : ''}
                  </p>
                  {canEdit && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        className={`${inputClass} max-w-xs py-2`}
                        placeholder="Kechiksa izoh (keyin +)"
                        value={comments[s.id] || ''}
                        onChange={(e) => setComments((c) => ({ ...c, [s.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => onPlus(s)}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white"
                        title="Kelgan. Izoh bo‘lsa — kechikkan"
                      >
                        <Plus size={18} />
                      </button>
                      <button
                        onClick={() => mark(s, 'absent')}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white"
                        title="Kelmadi — foiz tushadi"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {me.role === 'super_admin' && (
        <PrimaryBtn className="w-full" onClick={() => setExportOpen(true)}>
          <Download size={16} /> Excelga export qilish
        </PrimaryBtn>
      )}

      <Modal open={exportOpen} title="Davomatni Excelga yuklash" onClose={() => setExportOpen(false)}>
        <div className="space-y-3">
          <Field label="Davr">
            <select className={inputClass} value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="week">1 hafta</option>
              <option value="month">1 oy</option>
              <option value="all">Hammasi</option>
            </select>
          </Field>
          <Field label="Talaba (ixtiyoriy)">
            <select className={inputClass} value={oneStudent} onChange={(e) => setOneStudent(e.target.value)}>
              <option value="">Barcha talabalar</option>
              {users
                .filter((u) => u.role === 'student')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} · {u.studentId}
                  </option>
                ))}
            </select>
          </Field>
          <PrimaryBtn
            className="w-full"
            onClick={() => {
              exportAttendanceExcel({
                users,
                groups,
                records: attendance,
                studentId: oneStudent || null,
                period,
                filename: `davomat-${period}${oneStudent ? '-talaba' : '-barcha'}.xlsx`,
              })
              setExportOpen(false)
            }}
          >
            Yuklab olish
          </PrimaryBtn>
        </div>
      </Modal>
    </div>
  )
}

function Mini({ n, label, tone }) {
  const cls = tone === 'green' ? 'bg-emerald-50 text-emerald-800' : tone === 'yellow' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
  return (
    <div className={`rounded-2xl p-3 text-center ${cls}`}>
      <p className="text-2xl font-extrabold">{n}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  )
}

import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { EXAMS } from '../data/catalog'
import { EmptyState, RoleScreen, SoftCard, SoftRow, StatusChip } from '../components/StudentChrome'

export default function ExamsPage() {
  const navigate = useNavigate()
  return (
    <RoleScreen title="Imtihonlar jadvali">
      <div className="space-y-2.5">
        {EXAMS.map((e) => (
          <SoftRow
            key={e.id}
            icon={CalendarDays}
            title={e.subject}
            sub={`${e.date} · ${e.time}`}
            extra={<StatusChip>{e.type}</StatusChip>}
            onClick={() => navigate(`/exams/${e.id}`)}
          />
        ))}
        {!EXAMS.length && <EmptyState text="Imtihonlar hali e’lon qilinmagan." />}
      </div>
    </RoleScreen>
  )
}

export function ExamDetail() {
  const { id } = useParams()
  const exam = EXAMS.find((e) => e.id === id)
  if (!exam) {
    return (
      <RoleScreen title="Imtihon" back="/exams">
        <EmptyState text="Imtihon topilmadi." />
      </RoleScreen>
    )
  }
  return (
    <RoleScreen title={exam.type} back="/exams">
      <SoftCard>
        <h2 className="text-[20px] font-bold leading-snug">{exam.subject}</h2>
        <div className="mt-4 space-y-3 text-[15px] text-slate-600">
          <p className="flex items-center gap-2">
            <CalendarDays size={18} className="text-brand-700" /> {exam.date}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={18} className="text-brand-700" /> {exam.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-brand-700" /> {exam.room}
          </p>
        </div>
        <p className="mt-4 leading-relaxed text-slate-600">{exam.note}</p>
      </SoftCard>
    </RoleScreen>
  )
}

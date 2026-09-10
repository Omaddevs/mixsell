import { useNavigate, useParams } from 'react-router-dom'
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Download,
  FileText,
  Folder,
  Gavel,
  Megaphone,
} from 'lucide-react'
import { DOCUMENT_FILES } from '../data/catalog'
import { EmptyState, RoleScreen, SoftCard, SoftRow, StatusChip } from '../components/StudentChrome'

export const DOCUMENT_CATEGORIES = [
  { id: 'all', label: 'Talabaning barcha hujjatlari', icon: Folder },
  { id: 'housing', label: 'O‘qish joyidan ma’lumotnoma', icon: BadgeCheck },
  { id: 'military', label: 'Chaqiruv qog‘ozi', icon: Megaphone },
  { id: 'contract', label: 'Talabaning joriy yilgi to‘lov-shartnoma ma’lumotlari', icon: CalendarDays },
  { id: 'orders', label: 'Talaba buyruqlari', icon: Gavel },
  { id: 'other', label: 'Talabaning boshqa turdagi hujjatlari', icon: FileText },
  { id: 'certs', label: 'Talabaning sertifikat ma’lumotlari', icon: Award },
  { id: 'antiplag', label: 'Talabaning antiplagiat tizimi orqali tekshirilgan hujjatlari', icon: ClipboardCheck },
]

const TONE = {
  Faol: 'blue',
  Tasdiqlangan: 'green',
  Imzolangan: 'green',
  "To‘langan": 'green',
  Amalda: 'blue',
  Berilgan: 'green',
  "O‘tgan": 'green',
  Arxiv: 'slate',
}

export default function DocumentsPage() {
  const navigate = useNavigate()
  return (
    <RoleScreen title="Barcha hujjatlar">
      <div className="space-y-2.5">
        {DOCUMENT_CATEGORIES.map((row) => {
          const count = DOCUMENT_FILES.filter((f) => row.id === 'all' || f.cat === row.id).length
          return (
            <SoftRow
              key={row.id}
              icon={row.icon}
              title={row.label}
              sub={`${count} ta hujjat`}
              onClick={() => navigate(`/documents/${row.id}`)}
            />
          )
        })}
      </div>
    </RoleScreen>
  )
}

export function DocumentCategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cat = DOCUMENT_CATEGORIES.find((c) => c.id === id)
  const files = DOCUMENT_FILES.filter((f) => id === 'all' || f.cat === id)

  return (
    <RoleScreen title={cat?.label || 'Hujjatlar'} back="/documents">
      <div className="space-y-2.5">
        {files.map((f) => (
          <SoftRow
            key={f.id}
            icon={FileText}
            title={f.title}
            sub={`${f.date} · ${f.meta}`}
            extra={<StatusChip tone={TONE[f.status] || 'blue'}>{f.status}</StatusChip>}
            onClick={() => navigate(`/documents/${id}/${f.id}`)}
          />
        ))}
        {!files.length && <EmptyState text="Bu bo‘limda hozircha hujjat yo‘q." />}
      </div>
    </RoleScreen>
  )
}

export function DocumentFilePage() {
  const { id, fileId } = useParams()
  const file = DOCUMENT_FILES.find((f) => f.id === fileId)
  if (!file) {
    return (
      <RoleScreen title="Hujjat" back="/documents">
        <EmptyState text="Hujjat topilmadi." />
      </RoleScreen>
    )
  }
  return (
    <RoleScreen title="Hujjat" back={`/documents/${id}`}>
      <SoftCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold leading-snug">{file.title}</h2>
            <p className="mt-1 text-[13px] text-muted">
              {file.date} · {file.meta}
            </p>
          </div>
          <StatusChip tone={TONE[file.status] || 'blue'}>{file.status}</StatusChip>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{file.body}</p>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[16px] bg-brand-800 py-3 text-[16px] font-semibold text-white"
        >
          <Download size={18} /> Yuklab olish
        </button>
      </SoftCard>
    </RoleScreen>
  )
}

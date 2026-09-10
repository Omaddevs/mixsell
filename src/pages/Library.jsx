import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Plus, Search } from 'lucide-react'
import { useCurrentUser, useStore } from '../store/useStore'
import { Cover, Field, inputClass, Modal, PrimaryBtn, Tabs } from '../components/ui'
import { fileToDataUrl, formatBytes } from '../lib/utils'
import { EmptyState, RoleScreen, SoftCard } from '../components/StudentChrome'

export default function Library() {
  const me = useCurrentUser()
  const books = useStore((s) => s.books)
  const addBook = useStore((s) => s.addBook)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    downloadable: false,
    cover: 'book',
    fileData: '',
    fileName: '',
    format: 'PDF',
    size: '',
    bytes: 0,
  })
  const navigate = useNavigate()

  const list = books.filter((b) => {
    const hit = `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase())
    if (!hit) return false
    if (tab === 'new') return Date.now() - new Date(b.createdAt).getTime() < 1000 * 60 * 60 * 24 * 21
    if (tab === 'dl') return b.downloadable
    return true
  })

  const listUi = (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder="Kitob qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {me.role === 'super_admin' && (
          <PrimaryBtn className="shrink-0 py-2" onClick={() => setOpen(true)}>
            <Plus size={16} /> Kitob
          </PrimaryBtn>
        )}
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: 'all', label: 'Barchasi' },
          { id: 'new', label: 'Yangi' },
          { id: 'dl', label: 'Yuklab olinadigan' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => (
          <article key={b.id} className="overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(16,80,40,0.05)]">
            <button className="h-40 w-full" onClick={() => navigate(`/library/${b.id}`)}>
              {b.coverData ? <img src={b.coverData} alt="" className="h-40 w-full object-cover" /> : <Cover type={b.cover} title={b.title} />}
            </button>
            <div className="space-y-2 p-4">
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-sm text-muted">{b.author}</p>
              <p className="text-xs text-muted">
                {b.format} · {b.size} · <Eye className="inline h-3 w-3" /> {b.views}
              </p>
              <div className="flex gap-2">
                <PrimaryBtn className="flex-1 py-2" onClick={() => navigate(`/library/${b.id}/read`)}>
                  O‘qish
                </PrimaryBtn>
                <button
                  disabled={!b.downloadable}
                  onClick={() => downloadBook(b)}
                  className="flex-1 rounded-2xl border border-slate-200 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Yuklab olish
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!list.length && <EmptyState text="Kitob topilmadi." />}
    </>
  )

  return (
    <RoleScreen title="Kutubxona">
      <div className="space-y-4">
        {listUi}
        <Modal open={open} title="Kitob yuklash" onClose={() => setOpen(false)} wide>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            addBook({
              ...form,
              pages: form.fileData
                ? [{ title: form.title, body: 'Yuklangan PDF fayl platforma ichida ochiladi.' }]
                : form.pages,
            })
            setOpen(false)
          }}
        >
          <Field label="Sarlavha">
            <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Muallif">
            <input className={inputClass} required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </Field>
          <Field label="Tavsif">
            <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Muqova rasmi">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const coverData = await fileToDataUrl(f)
                setForm((x) => ({ ...x, coverData }))
              }}
            />
          </Field>
          <Field label="PDF fayl">
            <input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const fileData = await fileToDataUrl(f)
                setForm((x) => ({ ...x, fileData, fileName: f.name, size: formatBytes(f.size), bytes: f.size, format: 'PDF' }))
              }}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.downloadable} onChange={(e) => setForm({ ...form, downloadable: e.target.checked })} />
            Yuklab olishga ruxsat
          </label>
          <PrimaryBtn className="w-full" type="submit">
            Saqlash
          </PrimaryBtn>
        </form>
        </Modal>
      </div>
    </RoleScreen>
  )
}

export function downloadBook(b) {
  if (!b.downloadable) return
  if (b.fileData) {
    const a = document.createElement('a')
    a.href = b.fileData
    a.download = b.fileName || `${b.title}.pdf`
    a.click()
    return
  }
  const blob = new Blob(
    [`${b.title}\n${b.author}\n\n${(b.pages || []).map((p) => `${p.title}\n${p.body}`).join('\n\n')}`],
    { type: 'text/plain' },
  )
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${b.title}.txt`
  a.click()
}

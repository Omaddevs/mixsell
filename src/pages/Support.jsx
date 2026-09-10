import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { LifeBuoy, Plus } from 'lucide-react'
import { useCurrentUser, useStore } from '../store/useStore'
import { Field, inputClass, Modal, PrimaryBtn } from '../components/ui'
import { timeAgo } from '../lib/utils'
import { EmptyState, RoleScreen, SoftCard, SoftRow } from '../components/StudentChrome'

export default function Support() {
  const me = useCurrentUser()
  const tickets = useStore((s) => s.tickets)
  const users = useStore((s) => s.users)
  const addTicket = useStore((s) => s.addTicket)
  const replyTicket = useStore((s) => s.replyTicket)
  const navigate = useNavigate()
  const { id } = useParams()
  const [active, setActive] = useState(tickets[0]?.id)
  const [text, setText] = useState('')
  const [subject, setSubject] = useState('')
  const [first, setFirst] = useState('')
  const [open, setOpen] = useState(false)

  const visible = me.role === 'super_admin' ? tickets : tickets.filter((t) => t.userId === me.id)
  const ticketId = id || active
  const ticket = visible.find((t) => t.id === ticketId) || visible[0]

  if (me.role === 'student') {
    if (id) {
      const t = visible.find((x) => x.id === id)
      if (!t) {
        return (
          <RoleScreen title="Support" back="/support">
            <EmptyState text="Murojaat topilmadi." />
          </RoleScreen>
        )
      }
      return (
        <RoleScreen title={t.subject} back="/support">
          <SoftCard className="flex min-h-[360px] flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {t.messages.map((m) => {
                const u = users.find((x) => x.id === m.userId)
                const mine = m.userId === me.id
                return (
                  <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'ml-auto bg-brand-800 text-white' : 'bg-slate-100'}`}>
                    <p className="text-[10px] opacity-70">{u?.name}</p>
                    {m.text}
                  </div>
                )
              })}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!text.trim()) return
                replyTicket(t.id, text)
                setText('')
              }}
            >
              <input className={inputClass} value={text} onChange={(e) => setText(e.target.value)} placeholder="Javob yozing..." />
              <PrimaryBtn type="submit">Jo‘natish</PrimaryBtn>
            </form>
          </SoftCard>
        </RoleScreen>
      )
    }

    return (
      <RoleScreen
        title="Support"
        right={
          <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center" aria-label="Yangi">
            <Plus size={20} />
          </button>
        }
      >
        <div className="space-y-2.5">
          {visible.map((t) => (
            <SoftRow
              key={t.id}
              icon={LifeBuoy}
              title={t.subject}
              sub={timeAgo(t.createdAt)}
              onClick={() => navigate(`/support/${t.id}`)}
            />
          ))}
          {!visible.length && <EmptyState text="Murojaatlar yo‘q. Yangi xabar yozing." />}
        </div>
        <Modal open={open} title="Yangi murojaat" onClose={() => setOpen(false)}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              const created = addTicket({ subject, text: first })
              setSubject('')
              setFirst('')
              setOpen(false)
              navigate(`/support/${created.id}`)
            }}
          >
            <Field label="Mavzu">
              <input className={inputClass} required value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="Xabar">
              <textarea className={inputClass} rows={3} required value={first} onChange={(e) => setFirst(e.target.value)} />
            </Field>
            <PrimaryBtn className="w-full" type="submit">
              Yuborish
            </PrimaryBtn>
          </form>
        </Modal>
      </RoleScreen>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-3">
        {me.role !== 'super_admin' && (
          <form
            className="card space-y-2 p-4"
            onSubmit={(e) => {
              e.preventDefault()
              const t = addTicket({ subject, text: first })
              setActive(t.id)
              setSubject('')
              setFirst('')
            }}
          >
            <p className="font-bold">Yangi murojaat</p>
            <Field label="Mavzu">
              <input className={inputClass} required value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="Xabar">
              <textarea className={inputClass} rows={3} required value={first} onChange={(e) => setFirst(e.target.value)} />
            </Field>
            <PrimaryBtn className="w-full py-2" type="submit">
              Yuborish
            </PrimaryBtn>
          </form>
        )}
        {visible.map((t) => {
          const owner = users.find((u) => u.id === t.userId)
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`card w-full p-3 text-left ${ticket?.id === t.id ? 'ring-2 ring-brand-600' : ''}`}
            >
              <p className="font-semibold">{t.subject}</p>
              <p className="text-xs text-muted">
                {owner?.name} · {timeAgo(t.createdAt)}
              </p>
            </button>
          )
        })}
      </div>
      {ticket && (
        <div className="card flex min-h-[360px] flex-col p-4">
          <h3 className="font-bold">{ticket.subject}</h3>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto">
            {ticket.messages.map((m) => {
              const u = users.find((x) => x.id === m.userId)
              const mine = m.userId === me.id
              return (
                <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'ml-auto bg-brand-800 text-white' : 'bg-slate-100'}`}>
                  <p className="text-[10px] opacity-70">{u?.name}</p>
                  {m.text}
                </div>
              )
            })}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!text.trim()) return
              replyTicket(ticket.id, text)
              setText('')
            }}
          >
            <input className={inputClass} value={text} onChange={(e) => setText(e.target.value)} placeholder="Javob yozing..." />
            <PrimaryBtn type="submit">Jo‘natish</PrimaryBtn>
          </form>
        </div>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useCurrentUser, useStore } from '../store/useStore'
import { Avatar, Field, inputClass, PrimaryBtn } from '../components/ui'
import { ROLE_LABEL } from '../lib/utils'
import { RoleScreen, SoftCard } from '../components/StudentChrome'

export default function Settings() {
  const me = useCurrentUser()
  const upsertUser = useStore((s) => s.upsertUser)
  const resetDemo = useStore((s) => s.resetDemo)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <RoleScreen title="Sozlamalar">
      <div className="mx-auto max-w-lg space-y-4">
        <SoftCard>
          <div className="flex items-center gap-4">
            <Avatar name={me.name} color={me.avatarColor} size="xl" />
            <div>
              <p className="text-xl font-extrabold">{me.name}</p>
              <p className="text-sm text-muted">
                {ROLE_LABEL[me.role]} {me.studentId ? `· ${me.studentId}` : ''}
              </p>
              <p className="text-sm text-muted">{me.phone}</p>
            </div>
          </div>
        </SoftCard>
        <form
          className="space-y-3 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(16,80,40,0.05)]"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.target)
            upsertUser({
              ...me,
              name: data.get('name'),
              phone: data.get('phone'),
              email: data.get('email'),
            })
          }}
        >
          <Field label="Ism">
            <input name="name" className={inputClass} defaultValue={me.name} />
          </Field>
          <Field label="Telefon">
            <input name="phone" className={inputClass} defaultValue={me.phone} />
          </Field>
          <Field label="Email">
            <input name="email" className={inputClass} defaultValue={me.email} />
          </Field>
          <PrimaryBtn type="submit">Saqlash</PrimaryBtn>
        </form>
        <button
          className="w-full rounded-2xl border border-rose-200 py-3 text-sm font-semibold text-rose-700"
          onClick={() => {
            resetDemo()
            logout()
            navigate('/login')
          }}
        >
          Demo ma’lumotlarni tiklash
        </button>
      </div>
    </RoleScreen>
  )
}

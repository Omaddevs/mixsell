import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import { seed } from '../data/seed'
import { nextStudentId, uid } from '../lib/utils'

const DATA_KEYS = [
  'users',
  'groups',
  'schedule',
  'attendance',
  'assignments',
  'books',
  'announcements',
  'vacancies',
  'posts',
  'complaints',
  'tickets',
  'notifications',
  'currentUserId',
]

const notify = (set, get, payload) => {
  const item = {
    id: uid('n'),
    read: false,
    createdAt: new Date().toISOString(),
    ...payload,
  }
  set({ notifications: [item, ...get().notifications] })
}

export const useStore = create(
  persist(
    (set, get) => ({
      ...seed,
      currentUserId: null,

      login: (identity, password) => {
        const q = String(identity || '')
          .trim()
          .toLowerCase()
        const user = get().users.find((u) => {
          if (u.password !== password) return false
          if (u.email.toLowerCase() === q) return true
          if (u.studentId && u.studentId.toLowerCase() === q) return true
          return false
        })
        if (!user) return { ok: false, error: 'ID yoki parol noto‘g‘ri' }
        if (user.blocked) return { ok: false, error: 'Hisobingiz bloklangan. Super Admin bilan bog‘laning.' }
        set({ currentUserId: user.id })
        return { ok: true, user }
      },

      logout: () => set({ currentUserId: null }),

      register: ({ name, email, phone, password, role, groupId }) => {
        const users = get().users
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: 'Bu email allaqachon ro‘yxatdan o‘tgan' }
        }
        if (users.some((u) => u.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''))) {
          return { ok: false, error: 'Bu telefon raqam allaqachon ishlatilgan' }
        }
        const safeRole = role === 'teacher' ? 'teacher' : 'student'
        const user = {
          id: uid('u'),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: safeRole,
          blocked: false,
          createdAt: new Date().toISOString(),
          avatarColor: '#147a36',
          ...(safeRole === 'student'
            ? { studentId: nextStudentId(users), groupId: groupId || get().groups[0]?.id }
            : { subject: 'Umumiy', groupIds: get().groups.map((g) => g.id).slice(0, 2) }),
        }
        set({ users: [...users, user], currentUserId: user.id })
        notify(set, get, {
          userId: 'u_admin',
          title: 'Yangi foydalanuvchi',
          body: `${user.name} ${safeRole === 'student' ? 'talaba' : 'o‘qituvchi'} sifatida ro‘yxatdan o‘tdi.`,
          type: 'user',
        })
        return { ok: true, user }
      },

      markAttendance: ({ studentId, groupId, status, comment, subject, date: dateArg }) => {
        const me = get().users.find((u) => u.id === get().currentUserId)
        const date = dateArg || new Date().toISOString().slice(0, 10)
        const time = status === 'absent' ? '' : new Date().toTimeString().slice(0, 5)
        const records = get().attendance.filter(
          (r) => !(r.studentId === studentId && r.date === date && r.subject === subject),
        )
        const rec = {
          id: uid('a'),
          studentId,
          groupId,
          date,
          subject: subject || 'Dars',
          status,
          time,
          comment: comment || '',
          teacherId: me?.id,
        }
        set({ attendance: [rec, ...records] })
        if (status === 'late' && comment) {
          notify(set, get, {
            userId: 'u_admin',
            title: 'Kechikish izohi',
            body: `${get().users.find((u) => u.id === studentId)?.name}: ${comment}`,
            type: 'attendance',
          })
        }
        return rec
      },

      setUserBlocked: (userId, blocked) => {
        set({
          users: get().users.map((u) => (u.id === userId ? { ...u, blocked } : u)),
        })
        notify(set, get, {
          userId,
          title: blocked ? 'Hisob bloklandi' : 'Hisob ochildi',
          body: blocked
            ? 'Super Admin hisobingizni vaqtincha blokladi.'
            : 'Hisobingiz qayta faollashtirildi.',
          type: 'account',
        })
      },

      upsertUser: (user) => {
        const users = get().users
        const exists = users.some((u) => u.id === user.id)
        if (exists) set({ users: users.map((u) => (u.id === user.id ? { ...u, ...user } : u)) })
        else {
          const next = { ...user, id: user.id || uid('u') }
          if (next.role === 'student' && !next.studentId) next.studentId = nextStudentId(users)
          set({ users: [...users, next] })
        }
      },

      addGroup: (group) => set({ groups: [...get().groups, { id: uid('g'), ...group }] }),

      addSchedule: (payload) => {
        const item = { id: uid('sch'), room: '', date: '', weekday: 1, ...payload }
        set({ schedule: [item, ...get().schedule] })
        return item
      },

      updateSchedule: (id, payload) =>
        set({
          schedule: get().schedule.map((s) => (s.id === id ? { ...s, ...payload } : s)),
        }),

      removeSchedule: (id) => set({ schedule: get().schedule.filter((s) => s.id !== id) }),

      addAssignment: (payload) => {
        const item = {
          id: uid('as'),
          submissions: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          teacherId: get().currentUserId,
          ...payload,
        }
        set({ assignments: [item, ...get().assignments] })
        get()
          .users.filter((u) => u.role === 'student' && u.groupId === item.groupId)
          .forEach((s) =>
            notify(set, get, {
              userId: s.id,
              title: 'Yangi topshiriq',
              body: item.title,
              type: 'assignment',
            }),
          )
        return item
      },

      submitAssignment: (assignmentId, fileName) => {
        const meId = get().currentUserId
        set({
          assignments: get().assignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  submissions: [
                    ...a.submissions.filter((s) => s.studentId !== meId),
                    { studentId: meId, submittedAt: new Date().toISOString(), fileName },
                  ],
                }
              : a,
          ),
        })
      },

      addBook: (payload) => {
        const item = {
          id: uid('b'),
          views: 0,
          createdAt: new Date().toISOString(),
          uploadedBy: get().currentUserId,
          pages: payload.pages || [{ title: payload.title, body: payload.description || 'PDF yuklandi.' }],
          ...payload,
        }
        set({ books: [item, ...get().books] })
        get()
          .users.filter((u) => u.role === 'student')
          .forEach((s) =>
            notify(set, get, {
              userId: s.id,
              title: 'Yangi kitob',
              body: `${item.title} kutubxonaga qo‘shildi.`,
              type: 'library',
            }),
          )
        return item
      },

      bumpViews: (collection, id) => {
        set({
          [collection]: get()[collection].map((item) => (item.id === id ? { ...item, views: (item.views || 0) + 1 } : item)),
        })
      },

      addAnnouncement: (payload) => {
        const item = {
          id: uid('an'),
          views: 0,
          createdAt: new Date().toISOString(),
          authorId: get().currentUserId,
          ...payload,
        }
        set({ announcements: [item, ...get().announcements] })
        get()
          .users.filter((u) => u.id !== get().currentUserId)
          .forEach((u) =>
            notify(set, get, {
              userId: u.id,
              title: 'E’lon',
              body: item.title,
              type: 'announcement',
            }),
          )
        return item
      },

      addVacancy: (payload) => {
        const item = {
          id: uid('v'),
          views: 0,
          createdAt: new Date().toISOString(),
          authorId: get().currentUserId,
          ...payload,
        }
        set({ vacancies: [item, ...get().vacancies] })
        return item
      },

      addPost: (payload) => {
        const item = {
          id: uid('p'),
          views: 0,
          createdAt: new Date().toISOString(),
          authorId: get().currentUserId,
          ...payload,
        }
        set({ posts: [item, ...get().posts] })
        return item
      },

      addComplaint: ({ teacherId, subject, body }) => {
        const me = get().users.find((u) => u.id === get().currentUserId)
        const item = {
          id: uid('c'),
          studentId: me.id,
          teacherId,
          subject,
          body,
          status: 'new',
          adminNote: '',
          createdAt: new Date().toISOString(),
        }
        set({ complaints: [item, ...get().complaints] })
        notify(set, get, {
          userId: 'u_admin',
          title: 'Yangi shikoyat',
          body: `${me.name}: ${subject}`,
          type: 'complaint',
        })
        notify(set, get, {
          userId: me.id,
          title: 'Shikoyat qabul qilindi',
          body: `${subject} — holat: Yangi.`,
          type: 'complaint',
        })
        return item
      },

      updateComplaint: (id, { status, adminNote }) => {
        const prev = get().complaints.find((c) => c.id === id)
        set({
          complaints: get().complaints.map((c) => (c.id === id ? { ...c, status, adminNote } : c)),
        })
        if (prev) {
          const statusLabel = { new: 'Yangi', review: 'Ko‘rib chiqilmoqda', resolved: 'Muammo hal bo‘ldi' }[status]
          notify(set, get, {
            userId: prev.studentId,
            title: 'Shikoyat holati yangilandi',
            body: `${prev.subject}: ${statusLabel}${adminNote ? `. ${adminNote}` : ''}`,
            type: 'complaint',
          })
        }
      },

      addTicket: ({ subject, text }) => {
        const me = get().users.find((u) => u.id === get().currentUserId)
        const item = {
          id: uid('tck'),
          userId: me.id,
          subject,
          status: 'open',
          createdAt: new Date().toISOString(),
          messages: [{ id: uid('m'), userId: me.id, text, createdAt: new Date().toISOString() }],
        }
        set({ tickets: [item, ...get().tickets] })
        notify(set, get, {
          userId: 'u_admin',
          title: 'Support',
          body: `${me.name}: ${subject}`,
          type: 'support',
        })
        return item
      },

      replyTicket: (ticketId, text) => {
        const me = get().users.find((u) => u.id === get().currentUserId)
        set({
          tickets: get().tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  messages: [...t.messages, { id: uid('m'), userId: me.id, text, createdAt: new Date().toISOString() }],
                }
              : t,
          ),
        })
        const ticket = get().tickets.find((t) => t.id === ticketId)
        if (ticket && me.role === 'super_admin') {
          notify(set, get, {
            userId: ticket.userId,
            title: 'Support javobi',
            body: text,
            type: 'support',
          })
        } else if (ticket) {
          notify(set, get, {
            userId: 'u_admin',
            title: 'Support xabari',
            body: `${me.name}: ${text}`,
            type: 'support',
          })
        }
      },

      markNotifRead: (id) =>
        set({
          notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }),

      markAllRead: (userId) =>
        set({
          notifications: get().notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
        }),

      resetDemo: () => set({ ...seed, currentUserId: null }),
    }),
    {
      name: 'tizimsedu-db-v3',
      partialize: (state) => Object.fromEntries(DATA_KEYS.map((k) => [k, state[k]])),
    },
  ),
)

export function useCurrentUser() {
  return useStore((s) => s.users.find((u) => u.id === s.currentUserId) || null)
}

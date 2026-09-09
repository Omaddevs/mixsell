import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { sidebarUser } from '../data/dashboard'
import { avatarImage } from '../data/properties'

const ProfileContext = createContext(null)
const STORAGE_KEY = 'mixsells-profile'

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function defaults(stored = {}) {
  return {
    name: stored.name || sidebarUser.name,
    username: stored.username || sidebarUser.username,
    id: sidebarUser.id,
    email: sidebarUser.email,
    avatar: stored.avatar || avatarImage,
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => defaults(readStore()))

  useEffect(() => {
    const payload = {
      name: profile.name,
      username: profile.username,
    }
    if (typeof profile.avatar === 'string' && profile.avatar.startsWith('data:')) {
      payload.avatar = profile.avatar
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [profile])

  const updateProfile = useCallback((patch) => {
    setProfile((current) => ({ ...current, ...patch }))
  }, [])

  const value = useMemo(() => ({ profile, updateProfile }), [profile, updateProfile])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}

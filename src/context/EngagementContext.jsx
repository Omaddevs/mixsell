import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const EngagementContext = createContext(null)
const STORAGE_KEY = 'mixsells-engagement'

function cloneSeed(listing) {
  return {
    likes: listing.likes ?? 0,
    shares: listing.shares ?? 0,
    views: listing.views ?? 0,
    comments: listing.comments ? listing.comments.map((item) => ({ ...item })) : [],
    liked: false,
    saved: false,
  }
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    Object.keys(data).forEach((id) => {
      if (data[id]?.liked && data[id].saved == null) data[id].saved = true
    })
    return data
  } catch {
    return {}
  }
}

export function EngagementProvider({ children }) {
  const [byId, setById] = useState(readStore)
  const viewed = useRef(new Set())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(byId))
  }, [byId])

  const get = useCallback(
    (listing) => {
      const current = byId[listing.id]
      if (!current) return cloneSeed(listing)
      return {
        ...cloneSeed(listing),
        ...current,
        comments: current.comments ?? cloneSeed(listing).comments,
      }
    },
    [byId],
  )

  const patch = useCallback((listing, updater) => {
    setById((prev) => {
      const current = prev[listing.id] ?? cloneSeed(listing)
      return { ...prev, [listing.id]: updater(current) }
    })
  }, [])

  const toggleLike = useCallback(
    (listing) => {
      patch(listing, (current) => {
        const liked = !current.liked
        return {
          ...current,
          liked,
          likes: current.likes + (current.liked ? -1 : 1),
          saved: liked ? true : current.saved,
        }
      })
    },
    [patch],
  )

  const likeOnly = useCallback(
    (listing) => {
      patch(listing, (current) =>
        current.liked ? current : { ...current, liked: true, likes: current.likes + 1, saved: true },
      )
    },
    [patch],
  )

  const toggleSave = useCallback(
    (listing) => {
      patch(listing, (current) => ({ ...current, saved: !current.saved }))
    },
    [patch],
  )

  const addComment = useCallback(
    (listing, text, replyTo = null) => {
      const trimmed = text.trim()
      if (!trimmed) return
      patch(listing, (current) => ({
        ...current,
        comments: [
          ...current.comments,
          {
            id: `${listing.id}-u${Date.now()}`,
            author: 'siz',
            text: trimmed,
            time: 'hozir',
            parentId: replyTo ? replyTo.parentId || replyTo.id : null,
            replyTo: replyTo?.author ?? null,
          },
        ],
      }))
    },
    [patch],
  )

  const addShare = useCallback(
    (listing) => {
      patch(listing, (current) => ({ ...current, shares: current.shares + 1 }))
    },
    [patch],
  )

  const markView = useCallback(
    (listing) => {
      if (viewed.current.has(listing.id)) return
      viewed.current.add(listing.id)
      patch(listing, (current) => ({ ...current, views: current.views + 1 }))
    },
    [patch],
  )

  const savedIds = useMemo(
    () => Object.keys(byId).filter((id) => byId[id]?.liked || byId[id]?.saved),
    [byId],
  )

  const value = useMemo(
    () => ({ get, toggleLike, likeOnly, toggleSave, addComment, addShare, markView, savedIds }),
    [get, toggleLike, likeOnly, toggleSave, addComment, addShare, markView, savedIds],
  )

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>
}

export function useEngagement() {
  const ctx = useContext(EngagementContext)
  if (!ctx) {
    throw new Error('useEngagement must be used within EngagementProvider')
  }
  return ctx
}

export function useListingEngagement(listing) {
  const ctx = useEngagement()
  return {
    ...ctx.get(listing),
    toggleLike: () => ctx.toggleLike(listing),
    likeOnly: () => ctx.likeOnly(listing),
    toggleSave: () => ctx.toggleSave(listing),
    addComment: (text, replyTo) => ctx.addComment(listing, text, replyTo),
    addShare: () => ctx.addShare(listing),
    markView: () => ctx.markView(listing),
  }
}

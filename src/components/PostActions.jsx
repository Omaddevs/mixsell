import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Heart, MessageCircle, Send, X } from 'lucide-react'
import { useListingEngagement } from '../context/EngagementContext'

function formatCount(value) {
  if (value < 1000) return String(value)
  if (value < 10000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
  if (value < 1000000) return `${Math.round(value / 1000)}k`
  return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}m`
}

function listingLabel(listing) {
  return listing.title || listing.street
}

function threadComments(comments) {
  const roots = comments.filter((item) => !item.parentId)
  const replies = new Map()
  comments.forEach((item) => {
    if (!item.parentId) return
    const list = replies.get(item.parentId) ?? []
    list.push(item)
    replies.set(item.parentId, list)
  })
  return roots.map((item) => ({ ...item, replies: replies.get(item.id) ?? [] }))
}

function CommentBody({ item, onReply }) {
  return (
    <>
      <p>
        <strong>{item.author}</strong>
        {item.replyTo ? <span className="comment-mention">@{item.replyTo}</span> : null}
        {item.text}
      </p>
      <div className="comment-meta">
        <time>{item.time}</time>
        <button type="button" className="comment-reply-btn" onClick={() => onReply(item)}>
          Javob berish
        </button>
      </div>
    </>
  )
}

function CommentThread({ item, onReply }) {
  return (
    <li className="comment-item">
      <span className="comment-avatar" aria-hidden="true">
        {item.author.slice(0, 1).toUpperCase()}
      </span>
      <div>
        <CommentBody item={item} onReply={onReply} />
        {item.replies.length ? (
          <ul className="comment-replies">
            {item.replies.map((reply) => (
              <li key={reply.id} className="comment-item">
                <span className="comment-avatar" aria-hidden="true">
                  {reply.author.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <CommentBody item={reply} onReply={onReply} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  )
}

export default function PostActions({ listing, compact = false }) {
  const { likes, comments, shares, views, liked, toggleLike, addComment, addShare, markView } =
    useListingEngagement(listing)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [shared, setShared] = useState(false)
  const inputRef = useRef(null)
  const threads = useMemo(() => threadComments(comments), [comments])

  useEffect(() => {
    markView()
  }, [listing.id])

  useEffect(() => {
    if (!open) {
      setReplyTo(null)
      setDraft('')
      return undefined
    }
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      event.preventDefault()
      if (replyTo) setReplyTo(null)
      else setOpen(false)
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, replyTo])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open, replyTo])

  function stop(event) {
    event.stopPropagation()
    event.preventDefault()
  }

  function startReply(item) {
    setReplyTo(item)
  }

  async function share(event) {
    stop(event)
    const title = listingLabel(listing)
    const text = `${title} — MixSells`
    let ok = false
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href })
        ok = true
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    if (!ok) {
      try {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`)
        ok = true
      } catch {
        ok = true
      }
    }
    if (!ok) return
    addShare()
    setShared(true)
    window.setTimeout(() => setShared(false), 1400)
  }

  function submitComment(event) {
    event.preventDefault()
    addComment(draft, replyTo)
    setDraft('')
    setReplyTo(null)
  }

  return (
    <>
      <div
        className={`post-actions${compact ? ' is-compact' : ''}`}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={`post-action${liked ? ' is-liked' : ''}`}
          aria-label="Yoqtirish"
          aria-pressed={liked}
          onClick={(event) => {
            stop(event)
            toggleLike()
          }}
        >
          <Heart size={compact ? 18 : 22} strokeWidth={1.8} fill={liked ? 'currentColor' : 'none'} />
          <span>{formatCount(likes)}</span>
        </button>
        <button
          type="button"
          className="post-action post-action--icon"
          aria-label={`Izohlar${comments.length ? `, ${comments.length} ta` : ''}`}
          onClick={(event) => {
            stop(event)
            setOpen(true)
          }}
        >
          <MessageCircle size={compact ? 18 : 22} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className={`post-action post-action--icon${shared ? ' is-shared' : ''}`}
          aria-label={`Ulashish${shares ? `, ${shares} marta ulashilgan` : ''}`}
          title={shared ? 'Ulashildi' : 'Ulashish'}
          onClick={share}
        >
          <Send size={compact ? 18 : 22} strokeWidth={1.8} />
        </button>
        <p className="post-views" title="Ko‘rishlar">
          <Eye size={compact ? 15 : 16} strokeWidth={1.8} />
          <span>{formatCount(views)}</span>
        </p>
      </div>

      {open
        ? createPortal(
            <div className="comments-overlay" onClick={() => setOpen(false)} role="presentation">
              <div
                className="comments-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`comments-${listing.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <header className="comments-head">
                  <img src={listing.image} alt="" />
                  <div>
                    <p className="comments-kicker">Izohlar</p>
                    <h3 id={`comments-${listing.id}`}>{listingLabel(listing)}</h3>
                  </div>
                  <button type="button" className="comments-close" onClick={() => setOpen(false)} aria-label="Yopish">
                    <X size={18} />
                  </button>
                </header>

                <ul className="comments-list">
                  {threads.length ? (
                    threads.map((item) => <CommentThread key={item.id} item={item} onReply={startReply} />)
                  ) : (
                    <li className="comments-empty">Hali izoh yo‘q. Birinchi bo‘lib yozing.</li>
                  )}
                </ul>

                <div className="comments-composer">
                  {replyTo ? (
                    <div className="reply-banner">
                      <div>
                        <p>
                          Javob: <strong>{replyTo.author}</strong>
                        </p>
                        <p className="reply-banner-text">{replyTo.text}</p>
                      </div>
                      <button type="button" onClick={() => setReplyTo(null)} aria-label="Javobni bekor qilish">
                        <X size={16} />
                      </button>
                    </div>
                  ) : null}
                  <form className="comments-form" onSubmit={submitComment}>
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={replyTo ? `@${replyTo.author} ga javob...` : 'Izoh yozing...'}
                      aria-label={replyTo ? `${replyTo.author} ga javob` : 'Izoh'}
                    />
                    <button type="submit" disabled={!draft.trim()}>
                      {replyTo ? 'Javob' : 'Joylash'}
                    </button>
                  </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

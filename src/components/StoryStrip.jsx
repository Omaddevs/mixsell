import { useCallback, useMemo, useState } from 'react'
import { STORIES, readStorySeen, writeStorySeen } from '../data/stories'
import StoryViewer from './StoryViewer'

function StoryRing({ total, seenCount, children }) {
  const size = 76
  const stroke = 2.75
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const gap = total <= 1 ? 0 : Math.min(7.5, circumference / (total * 6))
  const length = (circumference - gap * total) / total

  return (
    <span className="story-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={index < seenCount ? 'var(--story-ring-seen)' : 'var(--story-ring)'}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-(index * (length + gap))}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      <span className="story-ring-face">{children}</span>
    </span>
  )
}

export default function StoryStrip() {
  const [seen, setSeen] = useState(readStorySeen)
  const [openId, setOpenId] = useState(null)

  const onSeen = useCallback((storyId, slideIndex) => {
    setSeen((current) => {
      const nextCount = Math.max(current[storyId] ?? 0, slideIndex + 1)
      if ((current[storyId] ?? 0) >= nextCount) return current
      const next = { ...current, [storyId]: nextCount }
      writeStorySeen(next)
      return next
    })
  }, [])

  const items = useMemo(() => STORIES, [])

  return (
    <section className="story-section" aria-labelledby="stories-title">
      <h2 id="stories-title">Storylar</h2>
      <div className="story-row">
        {items.map((item) => {
          const seenCount = Math.min(seen[item.id] ?? 0, item.slides.length)
          return (
            <button
              key={item.id}
              type="button"
              className="story-item"
              onClick={() => setOpenId(item.id)}
            >
              <StoryRing total={item.slides.length} seenCount={seenCount}>
                <span className="story-avatar" style={{ background: item.accent }}>
                  {item.mark}
                </span>
              </StoryRing>
              <span className="story-name">{item.name}</span>
            </button>
          )
        })}
      </div>
      {openId ? (
        <StoryViewer startId={openId} seen={seen} onSeen={onSeen} onClose={() => setOpenId(null)} />
      ) : null}
    </section>
  )
}

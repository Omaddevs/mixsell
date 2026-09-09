import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Phone, Share2, Volume2, VolumeX, X } from 'lucide-react'
import { STORIES } from '../data/stories'

const VIDEO_MAX = 15
const IMAGE_MAX = 5

function startSlide(story, seen) {
  const watched = seen[story.id] ?? 0
  return watched >= story.slides.length ? 0 : watched
}

export default function StoryViewer({ startId, seen, onSeen, onClose }) {
  const startIndex = Math.max(
    0,
    STORIES.findIndex((item) => item.id === startId),
  )
  const [storyIndex, setStoryIndex] = useState(startIndex)
  const [slideIndex, setSlideIndex] = useState(() => startSlide(STORIES[startIndex], seen))
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const seenRef = useRef(seen)
  const closeRef = useRef(onClose)
  const holdTimer = useRef(0)
  const holding = useRef(false)
  const advancing = useRef(false)
  const imageLeft = useRef(IMAGE_MAX * 1000)

  seenRef.current = seen
  closeRef.current = onClose

  const story = STORIES[storyIndex]
  const slides = story.slides
  const slide = slides[slideIndex]
  const phoneHref = `tel:${story.phone}`

  const goTo = useCallback((nextStoryIndex, nextSlideIndex) => {
    advancing.current = true
    setStoryIndex(nextStoryIndex)
    setSlideIndex(nextSlideIndex)
    setProgress(0)
    setFailed(false)
    setPaused(false)
    imageLeft.current = IMAGE_MAX * 1000
  }, [])

  const goNext = useCallback(() => {
    if (advancing.current) return
    const currentStory = STORIES[storyIndex]
    if (slideIndex < currentStory.slides.length - 1) {
      goTo(storyIndex, slideIndex + 1)
      return
    }
    if (storyIndex < STORIES.length - 1) {
      const next = STORIES[storyIndex + 1]
      goTo(storyIndex + 1, startSlide(next, seenRef.current))
      return
    }
    closeRef.current()
  }, [goTo, slideIndex, storyIndex])

  const goPrev = useCallback(() => {
    advancing.current = false
    if (slideIndex > 0) {
      goTo(storyIndex, slideIndex - 1)
      return
    }
    if (storyIndex > 0) {
      const prev = STORIES[storyIndex - 1]
      goTo(storyIndex - 1, Math.max(0, prev.slides.length - 1))
      return
    }
    setProgress(0)
    const video = videoRef.current
    if (video) video.currentTime = 0
  }, [goTo, slideIndex, storyIndex])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => setReady(true), 280)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') closeRef.current()
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useEffect(() => {
    function onVis() {
      if (document.hidden) setPaused(true)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    onSeen(story.id, slideIndex)
    advancing.current = false
    setProgress(0)
    setFailed(false)
    imageLeft.current = IMAGE_MAX * 1000
  }, [onSeen, slideIndex, story.id])

  useEffect(() => {
    const video = videoRef.current
    if (!video || failed) return
    video.muted = muted
    if (paused) {
      video.pause()
      return
    }
    const play = video.play()
    play?.catch(() => {
      setMuted(true)
      video.muted = true
      video.play().catch(() => setFailed(true))
    })
  }, [failed, muted, paused, slide.id])

  useEffect(() => {
    if (!failed || paused) return undefined
    let last = performance.now()
    let frame = 0
    function tick(now) {
      imageLeft.current -= now - last
      last = now
      const total = IMAGE_MAX * 1000
      setProgress(Math.min(1, 1 - imageLeft.current / total))
      if (imageLeft.current <= 0) {
        goNext()
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [failed, goNext, paused, slide.id])

  function onTimeUpdate() {
    const video = videoRef.current
    if (!video || failed) return
    const duration = Math.min(video.duration || VIDEO_MAX, VIDEO_MAX)
    if (!duration || Number.isNaN(duration)) return
    setProgress(Math.min(1, video.currentTime / duration))
    if (video.currentTime >= duration - 0.05) goNext()
  }

  function onPointerDown(event) {
    if (!ready) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    holdTimer.current = window.setTimeout(() => {
      holding.current = true
      setPaused(true)
    }, 160)
  }

  function onPointerUp(event) {
    if (!ready) return
    window.clearTimeout(holdTimer.current)
    if (holding.current) {
      holding.current = false
      setPaused(false)
      return
    }
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    if (event.clientX < rect.left + rect.width * 0.3) goPrev()
    else goNext()
  }

  function onPointerCancel() {
    window.clearTimeout(holdTimer.current)
    if (holding.current) {
      holding.current = false
      setPaused(false)
    }
  }

  function stop(event) {
    event.stopPropagation()
  }

  async function shareStory() {
    const url = `${window.location.origin}/?story=${story.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: `${story.name} — MixSell`, url })
        return
      }
    } catch {
      /* ignore cancel */
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* ignore */
    }
  }

  const nextStory = STORIES[storyIndex + 1]
  const nextSlide = slides[slideIndex + 1] ?? nextStory?.slides[0]

  return createPortal(
    <div className="story-viewer" role="dialog" aria-modal="true" aria-label={`${story.name} story`}>
      <button type="button" className="story-viewer-scrim" aria-label="Yopish" onClick={onClose} />
      <div
        ref={frameRef}
        className="story-frame"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerCancel}
        onPointerCancel={onPointerCancel}
      >
        {failed ? (
          <img className="story-media" src={slide.poster} alt="" />
        ) : (
          <video
            key={slide.id}
            ref={videoRef}
            className="story-media"
            src={slide.video}
            poster={slide.poster}
            playsInline
            autoPlay
            muted={muted}
            onTimeUpdate={onTimeUpdate}
            onEnded={goNext}
            onError={() => setFailed(true)}
          />
        )}
        {nextSlide ? (
          <video className="story-preload" src={nextSlide.video} preload="auto" muted playsInline />
        ) : null}

        <div className="story-shade story-shade--top" />
        <div className="story-shade story-shade--bottom" />

        <div className="story-progress" aria-hidden="true">
          {slides.map((item, index) => (
            <span key={item.id} className="story-progress-track">
              <span
                className="story-progress-fill"
                style={{
                  width: index < slideIndex ? '100%' : index === slideIndex ? `${progress * 100}%` : '0%',
                }}
              />
            </span>
          ))}
        </div>

        <header className="story-hud">
          <div className="story-who">
            <span className="story-who-mark" style={{ background: story.accent }}>
              {story.mark}
            </span>
            <strong>{story.name}</strong>
          </div>
          <div className="story-hud-actions">
            <button
              type="button"
              className="story-icon-btn"
              aria-label={muted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
              onClick={(event) => {
                stop(event)
                setMuted((value) => !value)
              }}
              onPointerDown={stop}
              onPointerUp={stop}
            >
              {muted ? <VolumeX size={18} strokeWidth={2} /> : <Volume2 size={18} strokeWidth={2} />}
            </button>
            <button
              type="button"
              className="story-icon-btn"
              aria-label="Ulashish"
              onClick={(event) => {
                stop(event)
                shareStory()
              }}
              onPointerDown={stop}
              onPointerUp={stop}
            >
              <Share2 size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="story-icon-btn"
              aria-label="Yopish"
              onClick={(event) => {
                stop(event)
                onClose()
              }}
              onPointerDown={stop}
              onPointerUp={stop}
            >
              <X size={20} strokeWidth={2.2} />
            </button>
          </div>
        </header>

        {slide.badge ? <p className="story-badge">{slide.badge}</p> : null}
        {slide.caption ? <p className="story-caption">{slide.caption}</p> : null}

        <a
          className="story-cta"
          href={phoneHref}
          onClick={stop}
          onPointerDown={stop}
          onPointerUp={stop}
        >
          <Phone size={18} strokeWidth={2.2} />
          {slide.cta}
        </a>
      </div>
    </div>,
    document.body,
  )
}

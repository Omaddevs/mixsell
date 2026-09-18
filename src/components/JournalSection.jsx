import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Clock3, X } from 'lucide-react'
import { journalArticles, journalFeatured } from '../data/journal'

const AUTOPLAY_MS = 5000

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="journal-ig" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0" stopColor="#ffdd55" />
          <stop offset="0.5" stopColor="#e1306c" />
          <stop offset="1" stopColor="#5851db" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke="url(#journal-ig)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.4" stroke="url(#journal-ig)" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="url(#journal-ig)" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="#29b6f6" />
      <path
        d="M6.6 12.2 16.9 8c.46-.18.9.24.72.72l-2.02 8.25c-.15.6-.83.86-1.34.5l-2.6-1.9-1.36 1.3c-.16.15-.38.13-.5-.06l-.32-2.4-2.3-.9c-.5-.2-.52-.92.02-1.06Z"
        fill="#fff"
      />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1.5" y="5.5" width="21" height="13" rx="4.5" fill="#ff0000" />
      <path d="M10.2 9.2v5.6l5.1-2.8-5.1-2.8Z" fill="#fff" />
    </svg>
  )
}

function ArticleOverlay({ article, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!article) return null

  return (
    <div className="journal-overlay" role="presentation" onClick={onClose}>
      <div
        className="journal-article-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-article-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="journal-modal-close" aria-label="Yopish" onClick={onClose}>
          <X size={18} strokeWidth={2.2} />
        </button>
        <div className="journal-article-photo">
          <img src={article.image} alt="" />
        </div>
        <div className="journal-article-body">
          {article.badge ? <span className="journal-badge">{article.badge}</span> : null}
          <h3 id="journal-article-title">{article.title}</h3>
          <p className="journal-article-meta">
            {article.date} <span aria-hidden="true">·</span> <Clock3 size={13} strokeWidth={2.2} /> {article.readTime}
          </p>
          {article.body.map((paragraph, index) => (
            <p key={index} className="journal-article-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

function AllArticlesOverlay({ onClose, onOpenArticle }) {
  const all = [...journalFeatured, ...journalArticles]

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="journal-overlay" role="presentation" onClick={onClose}>
      <div
        className="journal-all-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-all-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="journal-all-head">
          <h3 id="journal-all-title">Barcha maqolalar</h3>
          <button type="button" className="journal-modal-close" aria-label="Yopish" onClick={onClose}>
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>
        <div className="journal-all-grid">
          {all.map((item) => (
            <button
              type="button"
              key={item.id}
              className="journal-item-card"
              onClick={() => onOpenArticle(item)}
            >
              <span className="journal-item-photo">
                <img src={item.image} alt="" loading="lazy" />
              </span>
              <span className="journal-item-copy">
                <span className="journal-item-title">{item.title}</span>
                <span className="journal-item-meta">
                  {item.date} <span aria-hidden="true">·</span> <Clock3 size={12} strokeWidth={2.2} /> {item.readTime}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function JournalSection() {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [openArticle, setOpenArticle] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (paused || openArticle || showAll) return undefined
    timerRef.current = setInterval(() => {
      setSlide((value) => (value + 1) % journalFeatured.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [paused, openArticle, showAll])

  const current = journalFeatured[slide]

  return (
    <section className="journal-section" aria-labelledby="journal-title">
      <div className="journal-head">
        <div className="journal-head-copy">
          <span className="journal-badge journal-badge--head">Jurnal</span>
          <h2 id="journal-title">Maqolalar, maslahatlar va ko‘chmas mulk yangiliklari</h2>
        </div>
        <button type="button" className="journal-view-all" onClick={() => setShowAll(true)}>
          Barchasini ko‘rish
        </button>
      </div>

      <div className="journal-body">
        <div
          className="journal-featured"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {journalFeatured.map((item, index) => (
            <div
              key={item.id}
              className={`journal-featured-slide${index === slide ? ' is-active' : ''}`}
              aria-hidden={index !== slide}
            >
              <img src={item.image} alt="" />
            </div>
          ))}
          <div className="journal-featured-veil" />

          <div className="journal-dots" role="tablist" aria-label="Jurnal slaydlari">
            {journalFeatured.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === slide}
                aria-label={`${index + 1}-slayd`}
                className={`journal-dot${index === slide ? ' is-active' : ''}`}
                onClick={() => setSlide(index)}
              >
                <span
                  className="journal-dot-fill"
                  style={
                    index === slide
                      ? { animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>

          <div className="journal-featured-copy">
            <span className="journal-badge journal-badge--featured">{current.badge}</span>
            <h3>{current.title}</h3>
            <button type="button" className="journal-cta" onClick={() => setOpenArticle(current)}>
              Ko‘rish <ArrowRight size={15} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="journal-grid">
          {journalArticles.map((item) => (
            <button type="button" key={item.id} className="journal-item-card" onClick={() => setOpenArticle(item)}>
              <span className="journal-item-photo">
                <img src={item.image} alt="" loading="lazy" />
              </span>
              <span className="journal-item-copy">
                <span className="journal-item-title">{item.title}</span>
                <span className="journal-item-meta">
                  {item.date} <span aria-hidden="true">·</span> <Clock3 size={12} strokeWidth={2.2} /> {item.readTime}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="journal-subscribe">
        <div className="journal-subscribe-copy">
          <h3>Obuna bo‘ling</h3>
          <p>Ijtimoiy tarmoqlarda muhim narsalar bilan bo‘lishamiz</p>
        </div>
        <div className="journal-subscribe-icons">
          <button type="button" className="journal-social" aria-label="Instagram">
            <InstagramIcon />
          </button>
          <button type="button" className="journal-social" aria-label="Telegram">
            <TelegramIcon />
          </button>
          <button type="button" className="journal-social" aria-label="YouTube">
            <YoutubeIcon />
          </button>
        </div>
      </div>

      <ArticleOverlay article={openArticle} onClose={() => setOpenArticle(null)} />
      {showAll ? (
        <AllArticlesOverlay
          onClose={() => setShowAll(false)}
          onOpenArticle={(item) => {
            setShowAll(false)
            setOpenArticle(item)
          }}
        />
      ) : null}
    </section>
  )
}

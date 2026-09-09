import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SlidersHorizontal, X } from 'lucide-react'

export function FilterGroup({ title, children }) {
  return (
    <section className="filter-group">
      <h3>{title}</h3>
      <div className="filter-chips">{children}</div>
    </section>
  )
}

export function FilterOption({ selected, onClick, children }) {
  return (
    <button type="button" className={`filter-chip${selected ? ' is-on' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function FiltersButton({ count = 0, onReset, children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      event.preventDefault()
      setOpen(false)
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={`filters-btn${count ? ' has-filters' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={16} strokeWidth={2} />
        Filtrlar
        {count ? <span className="filters-btn-badge">{count}</span> : null}
      </button>

      {open
        ? createPortal(
            <div className="filters-overlay" onClick={() => setOpen(false)} role="presentation">
              <div
                className="filters-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="filters-title"
                onClick={(event) => event.stopPropagation()}
              >
                <header className="filters-head">
                  <h2 id="filters-title">Filtrlar</h2>
                  <button type="button" className="filters-close" onClick={() => setOpen(false)} aria-label="Yopish">
                    <X size={18} />
                  </button>
                </header>

                <div className="filters-body">{children}</div>

                <footer className="filters-foot">
                  <button type="button" className="filters-reset" onClick={onReset} disabled={!count}>
                    Tozalash
                  </button>
                  <button type="button" className="filters-apply" onClick={() => setOpen(false)}>
                    Qo‘llash
                  </button>
                </footer>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

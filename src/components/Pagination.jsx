import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const CATALOG_ROWS = 6

export function useCatalogPageSize() {
  const [size, setSize] = useState(5 * CATALOG_ROWS)

  useEffect(() => {
    const tablet = window.matchMedia('(max-width: 1199px)')
    const phone = window.matchMedia('(max-width: 767px)')

    function update() {
      if (phone.matches) setSize(2 * CATALOG_ROWS)
      else if (tablet.matches) setSize(3 * CATALOG_ROWS)
      else setSize(5 * CATALOG_ROWS)
    }

    update()
    tablet.addEventListener('change', update)
    phone.addEventListener('change', update)
    return () => {
      tablet.removeEventListener('change', update)
      phone.removeEventListener('change', update)
    }
  }, [])

  return size
}

function pageTokens(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const tokens = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) tokens.push('ellipsis-start')
  for (let n = start; n <= end; n += 1) tokens.push(n)
  if (end < pageCount - 1) tokens.push('ellipsis-end')
  tokens.push(pageCount)
  return tokens
}

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  return (
    <nav className="pager" aria-label="Sahifalar">
      <button
        type="button"
        className="pager-btn pager-btn--nav"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft size={18} strokeWidth={2.2} />
      </button>

      {pageTokens(page, pageCount).map((token) =>
        typeof token === 'string' ? (
          <span key={token} className="pager-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={token}
            type="button"
            className={`pager-btn${token === page ? ' is-on' : ''}`}
            onClick={() => onChange(token)}
            aria-current={token === page ? 'page' : undefined}
            aria-label={`${token}-sahifa`}
          >
            {token}
          </button>
        ),
      )}

      <button
        type="button"
        className="pager-btn pager-btn--nav"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Keyingi sahifa"
      >
        <ChevronRight size={18} strokeWidth={2.2} />
      </button>
    </nav>
  )
}

import { useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'

export default function ActionMenu({ items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="menu-btn"
        aria-label="Open actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal size={16} />
      </button>
      {open ? (
        <div className="action-menu" role="menu">
          {items.map((item) => (
            <button
              type="button"
              key={item.label}
              className="popover-item"
              role="menuitem"
              onClick={() => {
                item.onClick?.()
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'

export default function Dropdown({ value, options, onChange, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div className={`dropdown ${className}`.trim()} ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="chip-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || value}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dropdown-label">{value}</span>
        <ChevronDown size={14} strokeWidth={2} />
      </button>
      {open ? (
        <div className="popover" role="listbox">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`popover-item${option === value ? ' is-active' : ''}`}
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

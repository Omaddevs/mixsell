import { Bookmark } from 'lucide-react'
import { useListingEngagement } from '../context/EngagementContext'

export default function SaveButton({ listing, className = '', size = 18 }) {
  const { saved, toggleSave } = useListingEngagement(listing)
  const on = saved

  return (
    <button
      type="button"
      className={`save-btn${on ? ' is-on' : ''}${className ? ` ${className}` : ''}`}
      aria-label={on ? 'Saqlanganlardan olib tashlash' : 'E’lonni saqlash'}
      aria-pressed={on}
      title={on ? 'Saqlangan' : 'Saqlash'}
      onClick={(event) => {
        event.stopPropagation()
        event.preventDefault()
        toggleSave()
      }}
    >
      <Bookmark size={size} strokeWidth={1.8} fill={on ? 'currentColor' : 'none'} />
    </button>
  )
}

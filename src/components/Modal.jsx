export default function Modal({ title, onClose, children, labelledBy = 'modal-title', className = '' }) {
  return (
    <div className="overlay overlay--home" onClick={onClose} role="presentation">
      <div
        className={`modal${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={labelledBy}>{title}</h2>
        {children}
      </div>
    </div>
  )
}

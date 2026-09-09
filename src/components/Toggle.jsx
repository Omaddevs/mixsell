export default function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="toggle">
      <button
        type="button"
        className={`switch${checked ? ' is-on' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-knob" />
      </button>
      <span className="toggle-label">{label}</span>
      {hint ? (
        <span className="toggle-hint" title={hint} aria-label={hint}>
          i
        </span>
      ) : null}
    </label>
  )
}

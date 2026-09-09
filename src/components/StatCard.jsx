function MiniChart({ bars, tone }) {
  const max = Math.max(...bars, 1)

  return (
    <div className="mini-chart" aria-hidden="true">
      {bars.map((value, index) => {
        let colorClass = tone
        if (tone === 'mixed') {
          colorClass = index % 2 === 0 ? 'mixed-pos' : 'mixed-neg'
        }
        return (
          <span
            key={`${tone}-${index}`}
            className={`mini-bar ${colorClass}`}
            style={{ height: `${Math.max(18, (value / max) * 100)}%` }}
          />
        )
      })}
    </div>
  )
}

export default function StatCard({ stat }) {
  const positive = stat.change >= 0

  return (
    <article className="card stat-card">
      <div className="stat-top">
        <div className="stat-label-wrap">
          <span className="stat-icon" aria-hidden="true">
            {stat.icon}
          </span>
          <div>
            <p className="stat-title">
              {stat.title}
              {stat.badge ? <span className="ai-badge">{stat.badge}</span> : null}
            </p>
          </div>
        </div>
        <span className={`change ${positive ? 'up' : 'down'}`}>
          {positive ? '+' : ''}
          {stat.change}%
        </span>
      </div>
      <div className="stat-bottom">
        <p className="stat-value">{stat.value}</p>
        <MiniChart bars={stat.bars} tone={stat.tone} />
      </div>
    </article>
  )
}

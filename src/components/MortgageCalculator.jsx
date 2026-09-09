import { useMemo, useState } from 'react'
import Modal from './Modal'

function monthlyPayment(principal, annualRate, years) {
  if (principal <= 0 || years <= 0) return 0
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  const grow = (1 + r) ** n
  return (principal * r * grow) / (grow - 1)
}

export default function MortgageCalculator({ onClose }) {
  const [price, setPrice] = useState(185000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const result = useMemo(() => {
    const downPay = price * (down / 100)
    const loan = Math.max(price - downPay, 0)
    const monthly = monthlyPayment(loan, rate, years)
    return {
      downPay,
      loan,
      monthly,
      total: monthly * years * 12,
    }
  }, [price, down, rate, years])

  const money = (value) =>
    `$${Math.round(value).toLocaleString('en-US')}`

  return (
    <Modal title="Ipoteka kalkulyatori" onClose={onClose}>
      <div className="form-grid">
        <label>
          Uy narxi
          <input type="number" min="0" value={price} onChange={(event) => setPrice(Number(event.target.value) || 0)} />
        </label>
        <label>
          Boshlang‘ich to‘lov (%)
          <input type="number" min="0" max="100" value={down} onChange={(event) => setDown(Number(event.target.value) || 0)} />
        </label>
        <label>
          Yillik foiz stavkasi (%)
          <input type="number" min="0" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value) || 0)} />
        </label>
        <label>
          Muddat (yil)
          <input type="number" min="1" max="40" value={years} onChange={(event) => setYears(Number(event.target.value) || 1)} />
        </label>
      </div>

      <div className="calc-result">
        <p className="calc-result-label">Oylik to‘lov</p>
        <p className="calc-result-value">{money(result.monthly)}</p>
        <p className="calc-result-meta">
          Kredit: {money(result.loan)} · Jami to‘lov: {money(result.total)}
        </p>
      </div>

      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Yopish
        </button>
      </div>
    </Modal>
  )
}

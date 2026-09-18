import Modal from './Modal'

const ARTICLES = [
  {
    date: '8 Sep 2026',
    title: 'Toshkentda oilaviy uylar narxi barqaror qoldi',
    body: 'Chilonzor, Yunusobod va Mirzo Ulug‘bek tumanlarida 3–4 xonali uylar $150k atrofida saqlanib qolmoqda.',
  },
  {
    date: '4 Sep 2026',
    title: 'Ipoteka stavkalari kuzda yumshashi kutilmoqda',
    body: 'Oylik to‘lovni oldindan hisoblash uchun MixSells kalkulyatoridan foydalaning.',
  },
  {
    date: '1 Sep 2026',
    title: 'Xarita orqali qulay qidiruv',
    body: 'Geolokatsiya va to‘liq ekran xarita yordamida uylarni joylashuviga qarab tanlash osonlashdi.',
  },
]

export default function MarketJournal({ onClose }) {
  return (
    <Modal title="Ko‘chmas mulk jurnali" onClose={onClose} className="modal--wide">
      <ul className="journal-list">
        {ARTICLES.map((item) => (
          <li key={item.title} className="journal-item">
            <p className="journal-date">{item.date}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Yopish
        </button>
      </div>
    </Modal>
  )
}

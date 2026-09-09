import { Bell, Menu } from 'lucide-react'
import CategoryStrip from '../components/CategoryStrip'
import Layout from '../components/Layout'
import { useMobileMenu } from '../context/MobileMenuContext'
import { notifications } from '../data/dashboard'

function MenuToggle() {
  const { onOpenMenu } = useMobileMenu()
  return (
    <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
      <Menu size={18} />
    </button>
  )
}

export default function Notifications() {
  const unread = notifications.filter((item) => item.unread).length

  return (
    <Layout variant="home">
      <main className="listings-page">
        <div className="listings-toolbar">
          <div className="listings-heading">
            <MenuToggle />
            <h1>
              <Bell size={22} strokeWidth={2.2} color="#1363d2" />
              <span>Notification</span>
              <span className="listings-place">{unread} ta yangi</span>
            </h1>
          </div>
        </div>

        <CategoryStrip />

        <section className="listings-feed" aria-labelledby="notes-title">
          <div className="listings-feed-head">
            <div>
              <p className="listings-feed-kicker">Yangilanishlar</p>
              <h2 id="notes-title">E’lonlar va faoliyat</h2>
            </div>
            <p className="listings-feed-count">{notifications.length} ta bildirishnoma</p>
          </div>

          <ul className="inbox-list">
            {notifications.map((item) => (
              <li key={item.id}>
                <button type="button" className={`inbox-row${item.unread ? ' is-unread' : ''}`}>
                  <span className="inbox-avatar inbox-avatar--bell" aria-hidden="true">
                    <Bell size={16} strokeWidth={2} />
                  </span>
                  <span className="inbox-copy">
                    <strong>{item.title}</strong>
                    <em>{item.body}</em>
                  </span>
                  <time>{item.time}</time>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  )
}

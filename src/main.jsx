import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './styles/globals.css'
import './styles/sidebar.css'
import './styles/listings.css'
import './styles/journal-section.css'
import './styles/chat.css'
import './styles/profile.css'
import './styles/add-listing.css'
import './styles/sky-hero.css'
import './styles/topbar.css'
import './styles/mobile-tabbar.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

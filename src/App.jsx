import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'
import Saved from './pages/Saved'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import { EngagementProvider } from './context/EngagementContext'
import { MapSearchProvider } from './context/MapSearchContext'
import { ProfileProvider } from './context/ProfileContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ProfileProvider>
          <EngagementProvider>
            <MapSearchProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/avto" element={<Cars />} />
                <Route path="/saqlangan" element={<Saved />} />
                <Route path="/habarlar" element={<Messages />} />
                <Route path="/notification" element={<Notifications />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/sozlamalar" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MapSearchProvider>
          </EngagementProvider>
        </ProfileProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

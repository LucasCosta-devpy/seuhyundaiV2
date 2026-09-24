import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './pages/PublicSite.jsx'
import { RegionPage, CountryPage, CityPage } from './pages/DestinationPages.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/destinos/:regionSlug" element={<RegionPage />} />
          <Route path="/destinos/:regionSlug/:countrySlug" element={<CountryPage />} />
          <Route path="/destinos/:regionSlug/:countrySlug/:citySlug" element={<CityPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/painel" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

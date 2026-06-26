import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Search } from './pages/Search'
import { ClinicDetails } from './pages/ClinicDetails'
import { ServiceDetails } from './pages/ServiceDetails'
import { Clinics } from './pages/Clinics'
import { Services } from './pages/Services'
import { Compare } from './pages/Compare'
import { History } from './pages/History'
import { Statistics } from './pages/Statistics'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthProvider } from './context/AuthContext'
const queryClient = new QueryClient()



function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="search" element={<Search />} />
              <Route path="clinics" element={<Clinics />} />
              <Route path="clinics/:id" element={<ClinicDetails />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:id" element={<ServiceDetails />} />
              <Route path="compare" element={<Compare />} />
              <Route path="history" element={<History />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

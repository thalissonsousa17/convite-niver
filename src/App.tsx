import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PartyDecor from './components/PartyDecor'
import ConviteFlow from './pages/ConviteFlow'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import GrupoConvite from './pages/GrupoConvite'
import { useAuth } from './hooks/useAuth'

function Palco({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <PartyDecor />
      {children}
    </div>
  )
}

function AdminRoute() {
  const { session, carregando } = useAuth()
  if (carregando) {
    return (
      <Palco>
        <p className="relative z-10 text-creme/60">Carregando…</p>
      </Palco>
    )
  }
  return <Palco>{session ? <AdminDashboard /> : <AdminLogin />}</Palco>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Palco>
              <ConviteFlow />
            </Palco>
          }
        />
        <Route path="/admin" element={<AdminRoute />} />
        <Route
          path="/g/:slug"
          element={
            <Palco>
              <GrupoConvite />
            </Palco>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

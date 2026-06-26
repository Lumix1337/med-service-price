import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-card overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background rounded-tl-2xl border-t border-l border-border shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'

export function Sidebar() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navigation = [
    { nameKey: 'nav.dashboard', href: '/dashboard', icon: HomeIcon },
    { nameKey: 'nav.search', href: '/search', icon: MagnifyingGlassIcon },
    { nameKey: 'nav.clinics', href: '/clinics', icon: BuildingOfficeIcon },
    { nameKey: 'nav.services', href: '/services', icon: ClipboardDocumentListIcon },
    { nameKey: 'nav.priceComparison', href: '/compare', icon: CurrencyDollarIcon },
    { nameKey: 'nav.history', href: '/history', icon: ClockIcon },
    { nameKey: 'nav.statistics', href: '/statistics', icon: ChartBarIcon },
  ] as const

  return (
    <aside className="w-64 bg-card flex flex-col h-full border-r border-border">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <span className="text-primary-foreground font-bold text-xl leading-none">M</span>
        </div>
        <span className="font-bold text-foreground text-lg tracking-tight">MedPrice.kz</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          {t('nav.overview')}
        </div>
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
            {t(item.nameKey)}
          </NavLink>
        ))}
        
        <div className="mt-8 pt-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            {t('nav.system')}
          </div>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <Cog6ToothIcon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
            {t('nav.settings')}
          </NavLink>
        </div>
      </nav>
      
      <div className="p-4 border-t border-border m-4 rounded-xl bg-background border flex-shrink-0">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold">
                {user.avatar || user.name.charAt(0)}
              </div>
              <div className="ml-3 overflow-hidden flex-1">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full justify-center px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1.5" />
              {t('auth.logout', 'Выйти')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            {t('auth.login', 'Войти')}
          </button>
        )}
      </div>
    </aside>
  )
}

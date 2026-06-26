import { MagnifyingGlassIcon, BellIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-card border-b border-border z-10">
      <div className="flex flex-1 items-center">
        <div className="max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors shadow-sm"
            placeholder={t('header.quickSearch')}
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-4">
        <LanguageSwitcher />

        <div className="flex items-center text-xs font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border shadow-sm">
          <ArrowPathIcon className="h-3.5 w-3.5 mr-1.5" />
          {t('header.lastUpdate', { minutes: 12 })}
        </div>
        
        <button className="p-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm">
          <span className="sr-only">{t('header.notifications')}</span>
          <BellIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

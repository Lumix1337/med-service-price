import { useState, useMemo } from 'react';
import { useSearch, type SearchFilters, type SearchResult } from '@/services/search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocale } from '@/i18n';

export function Search() {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ city: '', category: '', sortBy: 'price_asc' });
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [onlineBookingOnly, setOnlineBookingOnly] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<string[]>(() => {
    const saved = localStorage.getItem('price_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: results, isLoading } = useSearch(query, filters);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSubscription = (serviceId: string, serviceName: string, clinicName: string) => {
    let updated: string[];
    if (subscriptions.includes(serviceId)) {
      updated = subscriptions.filter(id => id !== serviceId);
      showToast(`Вы отписались от уведомлений по услуге "${serviceName}"`);
    } else {
      updated = [...subscriptions, serviceId];
      const subDetails = JSON.parse(localStorage.getItem('price_sub_details') || '{}');
      subDetails[serviceId] = { serviceName, clinicName, date: new Date().toLocaleDateString() };
      localStorage.setItem('price_sub_details', JSON.stringify(subDetails));
      showToast(`Вы подписались на уведомления о снижении цены на "${serviceName}" в "${clinicName}"!`);
    }
    setSubscriptions(updated);
    localStorage.setItem('price_subscriptions', JSON.stringify(updated));
  };

  // Client-side advanced filtering
  const filteredResults = useMemo(() => {
    if (!results) return [];
    return results.filter((item: SearchResult) => {
      if (minPrice !== '' && item.price < minPrice) return false;
      if (maxPrice !== '' && item.price > maxPrice) return false;
      
      // Calculate mock clinic ratings & booking availability
      const nameLower = item.clinicName.toLowerCase();
      let rating = 4.5;
      let onlineBooking = true;
      if (nameLower.includes('kdl') || nameLower.includes('олимп')) {
        rating = 4.8;
        onlineBooking = true;
      } else if (nameLower.includes('invitro') || nameLower.includes('инвитро')) {
        rating = 4.6;
        onlineBooking = true;
      } else if (nameLower.includes('sunkar') || nameLower.includes('сункар')) {
        rating = 4.2;
        onlineBooking = false;
      }
      
      if (ratingFilter !== '' && rating < ratingFilter) return false;
      if (onlineBookingOnly && !onlineBooking) return false;
      
      return true;
    });
  }, [results, minPrice, maxPrice, ratingFilter, onlineBookingOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  const handleExportCSV = () => {
    if (!filteredResults || filteredResults.length === 0) return;
    
    // CSV structure (using \uFEFF for proper UTF-8 Excel formatting of Cyrillic text)
    const headers = ['Услуга', 'Категория', 'Клиника', 'Город', 'Цена (₸)', 'Дата обновления'];
    const rows = filteredResults.map((item: SearchResult) => [
      `"${item.serviceName.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      `"${item.clinicName.replace(/"/g, '""')}"`,
      `"${item.city.replace(/"/g, '""')}"`,
      item.price,
      new Date(item.updatedAt).toLocaleDateString(locale)
    ]);
    
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e: (string | number)[]) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `med_prices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
          <CheckIcon className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
      {/* Filters Sidebar */}
      <div className="w-full lg:w-72 bg-card border-r border-border p-6 flex flex-col space-y-6 overflow-y-auto shrink-0">
        <div className="flex items-center space-x-2 text-foreground font-semibold">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary" />
          <span>{t('search.filters')}</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('search.city')}</label>
            <select 
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-foreground"
              value={filters.city}
              onChange={e => setFilters({...filters, city: e.target.value})}
            >
              <option value="">{t('search.allCities')}</option>
              <option value="Astana">Astana</option>
              <option value="Almaty">Almaty</option>
              <option value="Shymkent">Shymkent</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('search.category')}</label>
            <select 
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-foreground"
              value={filters.category}
              onChange={e => setFilters({...filters, category: e.target.value})}
            >
              <option value="">{t('search.allCategories')}</option>
              <option value="Лаборатория">{t('search.laboratory')}</option>
              <option value="Диагностика">{t('search.diagnostics')}</option>
              <option value="Приём врача">{t('search.doctorVisit')}</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Диапазон цен (₸)</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full h-9 text-xs"
              />
              <span className="text-muted-foreground text-sm">—</span>
              <Input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Минимальный рейтинг</label>
            <select 
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-foreground"
              value={ratingFilter}
              onChange={e => setRatingFilter(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Любой рейтинг</option>
              <option value="4">4.0+ ★</option>
              <option value="4.5">4.5+ ★</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input 
              type="checkbox"
              id="onlineBooking"
              checked={onlineBookingOnly}
              onChange={e => setOnlineBookingOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-background"
            />
            <label htmlFor="onlineBooking" className="text-sm font-medium text-foreground select-none cursor-pointer">
              Есть онлайн-запись
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('search.sortBy')}</label>
            <select 
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-foreground"
              value={filters.sortBy}
              onChange={e => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="price_asc">{t('search.priceLowHigh')}</option>
              <option value="price_desc">{t('search.priceHighLow')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 flex flex-col space-y-6 overflow-y-auto bg-background">
        <div className="max-w-4xl w-full mx-auto">
          <form onSubmit={handleSearch} className="relative shadow-sm group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              type="text" 
              className="w-full pl-12 pr-24 py-7 text-lg rounded-xl border-border bg-card shadow-sm focus-visible:ring-primary transition-all text-foreground" 
              placeholder={t('search.placeholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" className="absolute right-2 top-2 bottom-2 rounded-lg px-8 text-md font-medium">
              {t('search.searchButton')}
            </Button>
          </form>
          
          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">{t('search.suggestions')}</span>
            {['ОАК', 'МРТ', 'УЗИ', 'Прием терапевта'].map(s => (
              <Badge 
                key={s} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs font-normal border border-transparent hover:border-primary/20 text-foreground"
                onClick={() => { setSearchInput(s); setQuery(s); }}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="max-w-4xl w-full mx-auto mt-8">
          <Card className="border-border shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-card/50 pb-4">
              <CardTitle className="text-lg font-medium flex justify-between items-center">
                <span>{t('search.results')}</span>
                <div className="flex items-center space-x-2">
                  {filteredResults.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportCSV}
                      className="text-xs h-7 px-3 border-border hover:border-primary hover:text-primary transition-colors bg-background"
                    >
                      📥 Экспорт CSV
                    </Button>
                  )}
                  <Badge variant="outline" className="text-xs font-normal bg-background text-foreground">
                    {isLoading ? '...' : t('search.found', { count: filteredResults.length })}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/50">
                      <TableHead className="w-[300px]">{t('search.serviceName')}</TableHead>
                      <TableHead>{t('search.clinic')}</TableHead>
                      <TableHead>{t('search.location')}</TableHead>
                      <TableHead className="text-right">{t('search.price')}</TableHead>
                      <TableHead className="text-right">{t('search.lastUpdated')}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <MagnifyingGlassIcon className="w-8 h-8 opacity-20" />
                            <p>{t('search.noResults')}</p>
                            <Button variant="link" onClick={() => {setSearchInput(''); setQuery(''); setMinPrice(''); setMaxPrice('');}}>{t('search.clearSearch')}</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResults.map((res: SearchResult) => (
                        <TableRow key={res.id} className="group">
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center space-x-2">
                              <span>{res.serviceName}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubscription(res.id, res.serviceName, res.clinicName);
                                }}
                                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none shrink-0"
                                title="Подписаться на изменение цены"
                              >
                                {subscriptions.includes(res.id) ? (
                                  <BellSolidIcon className="w-4 h-4 text-primary animate-pulse" />
                                ) : (
                                  <BellIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 hidden lg:block">{res.category}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{res.clinicName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <Badge variant="outline" className="font-normal bg-background text-foreground w-max">{res.city}</Badge>
                              <a 
                                href={`https://2gis.kz/${res.city.toLowerCase()}/search/${encodeURIComponent(res.clinicName)}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[11px] text-primary hover:underline font-medium block w-max"
                              >
                                Маршрут в 2GIS ↗
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold tabular-nums text-primary">
                            {res.price.toLocaleString(locale)} ₸
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm text-right">
                            {new Date(res.updatedAt).toLocaleDateString(locale)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 border-border hover:border-primary hover:text-primary transition-all bg-background"
                              onClick={() => navigate(`/services`)}
                            >
                              {t('search.details')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

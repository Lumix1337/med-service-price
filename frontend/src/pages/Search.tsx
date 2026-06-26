import { useState } from 'react';
import { useSearch, type SearchFilters } from '@/services/search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocale } from '@/i18n';

export function Search() {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ city: '', category: '', sortBy: 'price_asc' });
  const navigate = useNavigate();

  const { data: results, isLoading } = useSearch(query, filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-in fade-in duration-500">
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
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
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
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              value={filters.category}
              onChange={e => setFilters({...filters, category: e.target.value})}
            >
              <option value="">{t('search.allCategories')}</option>
              <option value="Лаборатория">{t('search.laboratory')}</option>
              <option value="Диагностика">{t('search.diagnostics')}</option>
              <option value="Приём врача">{t('search.doctorVisit')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('search.sortBy')}</label>
            <select 
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
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
              className="w-full pl-12 pr-24 py-7 text-lg rounded-xl border-border bg-card shadow-sm focus-visible:ring-primary transition-all" 
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
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs font-normal border border-transparent hover:border-primary/20"
                onClick={() => { setSearchInput(s); setQuery(s); }}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="max-w-4xl w-full mx-auto mt-8">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border bg-card/50 pb-4">
              <CardTitle className="text-lg font-medium flex justify-between items-center">
                <span>{t('search.results')}</span>
                <Badge variant="outline" className="text-xs font-normal bg-background">
                  {isLoading ? '...' : t('search.found', { count: results?.length || 0 })}
                </Badge>
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
                    ) : results?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <MagnifyingGlassIcon className="w-8 h-8 opacity-20" />
                            <p>{t('search.noResults')}</p>
                            <Button variant="link" onClick={() => {setSearchInput(''); setQuery('');}}>{t('search.clearSearch')}</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      results?.map((res) => (
                        <TableRow key={res.id} className="group">
                          <TableCell className="font-medium text-foreground">
                            {res.serviceName}
                            <div className="text-xs text-muted-foreground mt-1 hidden lg:block">{res.category}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{res.clinicName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal bg-background">{res.city}</Badge>
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

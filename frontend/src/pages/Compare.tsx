import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScaleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export function Compare() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const clinics = [
    { id: '1', name: 'KDL Olymp', rating: 4.8, price: 2500, time: '24 ч', updated: 'Сегодня' },
    { id: '2', name: 'Invivo', rating: 4.5, price: 2800, time: '24 ч', updated: 'Вчера' },
    { id: '3', name: 'Medical Park', rating: 4.9, price: 3000, time: '12 ч', updated: 'Сегодня' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t('compare.title', 'Сравнение цен')}</h1>
        <p className="text-muted-foreground">{t('compare.subtitle', 'Сравните стоимость услуг в разных лабораториях и клиниках')}</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-card border-b border-border">
          <div className="flex items-center space-x-2">
            <ScaleIcon className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-medium">Общий анализ крови (ОАК)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-1/4 font-semibold">{t('compare.feature', 'Характеристика')}</TableHead>
                  {clinics.map(c => (
                    <TableHead key={c.id} className="text-center font-semibold text-foreground">
                      {c.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">{t('compare.price', 'Цена (₸)')}</TableCell>
                  {clinics.map(c => (
                    <TableCell key={c.id} className="text-center">
                      <span className={`font-bold ${c.price === 2500 ? 'text-primary' : ''}`}>
                        {c.price.toLocaleString()} ₸
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">{t('compare.time', 'Срок исполнения')}</TableCell>
                  {clinics.map(c => (
                    <TableCell key={c.id} className="text-center">{c.time}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">{t('compare.rating', 'Рейтинг клиники')}</TableCell>
                  {clinics.map(c => (
                    <TableCell key={c.id} className="text-center font-medium">{c.rating} / 5.0</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">{t('compare.homeTake', 'Забор на дому')}</TableCell>
                  <TableCell className="text-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircleIcon className="w-5 h-5 text-muted-foreground mx-auto" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">{t('compare.updated', 'Актуальность цены')}</TableCell>
                  {clinics.map(c => (
                    <TableCell key={c.id} className="text-center text-xs text-muted-foreground">{c.updated}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  {clinics.map(c => (
                    <TableCell key={c.id} className="text-center py-4">
                      <button className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium rounded-md transition-colors w-full">
                        {t('compare.book', 'Записаться')}
                      </button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartPieIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';

export function Statistics() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const barData = [
    { name: 'Алматы', ОАК: 2800, 'МРТ': 22000, 'Прием': 12000 },
    { name: 'Астана', ОАК: 2500, 'МРТ': 18000, 'Прием': 10000 },
    { name: 'Шымкент', ОАК: 2000, 'МРТ': 15000, 'Прием': 8000 },
  ];

  const pieData = [
    { name: 'KDL Olymp', value: 45 },
    { name: 'Invivo', value: 30 },
    { name: 'Medical Park', value: 15 },
    { name: 'Другие', value: 10 },
  ];

  const COLORS = ['#FF4F00', '#FF7A33', '#FFA566', '#FFD099'];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t('statistics.title', 'Рыночная статистика')}</h1>
        <p className="text-muted-foreground">{t('statistics.subtitle', 'Аналитика цен и долей рынка медицинских услуг')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-card border-b border-border">
            <div className="flex items-center space-x-2">
              <PresentationChartBarIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-medium">{t('statistics.avgPriceByCity', 'Средние цены по городам (₸)')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[400px]">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6F767E' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F767E' }} />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="ОАК" fill="#FF4F00" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="МРТ" fill="#FF7A33" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Прием" fill="#FFA566" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="bg-card border-b border-border">
            <div className="flex items-center space-x-2">
              <ChartPieIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-medium">{t('statistics.marketShare', 'Доля рынка лабораторий (%)')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[400px] flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="w-[300px] h-[300px] rounded-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

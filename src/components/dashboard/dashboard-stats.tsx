'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Package } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalRfqs: number;
    pendingRfqs: number;
    activeOffers: number;
    completedOrders: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const t = useTranslations('dashboard.stats');

  const statCards = [
    {
      title: t('totalRfqs'),
      value: stats.totalRfqs,
      icon: FileText,
      description: t('descriptions.totalRfqs'),
    },
    {
      title: t('pendingRfqs'),
      value: stats.pendingRfqs,
      icon: Clock,
      description: t('descriptions.pendingRfqs'),
      color: 'text-yellow-600',
    },
    {
      title: t('activeOffers'),
      value: stats.activeOffers,
      icon: Package,
      description: t('descriptions.activeOffers'),
      color: 'text-blue-600',
    },
    {
      title: t('completedOrders'),
      value: stats.completedOrders,
      icon: CheckCircle,
      description: t('descriptions.completedOrders'),
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 text-muted-foreground ${stat.color || ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

















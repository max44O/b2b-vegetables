'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, FileText, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminStatsData {
  totalUsers: number;
  pendingUsers: number;
  totalRfqs: number;
  pendingRfqs: number;
}

export function AdminStats() {
  const t = useTranslations('admin.stats');
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    pendingUsers: 0,
    totalRfqs: 0,
    pendingRfqs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      description: t('descriptions.totalUsers'),
      color: 'text-blue-600',
    },
    {
      title: t('pendingUsers'),
      value: stats.pendingUsers,
      icon: UserCheck,
      description: t('descriptions.pendingUsers'),
      color: 'text-yellow-600',
    },
    {
      title: t('totalRfqs'),
      value: stats.totalRfqs,
      icon: FileText,
      description: t('descriptions.totalRfqs'),
      color: 'text-green-600',
    },
    {
      title: t('pendingRfqs'),
      value: stats.pendingRfqs,
      icon: Clock,
      description: t('descriptions.pendingRfqs'),
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
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

















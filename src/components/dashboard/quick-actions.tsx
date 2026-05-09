'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const t = useTranslations('dashboard.quickActions');

  const actions = [
    {
      title: t('browseProducts'),
      description: t('browseProductsDesc'),
      icon: Package,
      href: '/products',
      variant: 'default' as const,
    },
    {
      title: t('createRfq'),
      description: t('createRfqDesc'),
      icon: Plus,
      href: '/rfq/cart',
      variant: 'secondary' as const,
    },
    {
      title: t('viewOffers'),
      description: t('viewOffersDesc'),
      icon: Eye,
      href: '/rfq/my-requests',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto p-6 flex flex-col items-center space-y-2"
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm opacity-80">{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

















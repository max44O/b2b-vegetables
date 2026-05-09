'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, formatWeight } from '@/lib/utils';
import { Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

interface RFQ {
  id: string;
  status: string;
  createdAt: Date;
  notes?: string | null;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      nameRo: string | null;
    };
  }>;
  offers: Array<{
    id: string;
    createdAt: Date;
    totalAmount: any; // Decimal from Prisma
  }>;
}

interface RecentRFQsProps {
  rfqs: RFQ[];
}

export function RecentRFQs({ rfqs }: RecentRFQsProps) {
  const t = useTranslations('dashboard');
  const tRfq = useTranslations('rfq');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'OFFERED':
        return 'default';
      case 'ACCEPTED':
        return 'default';
      case 'DECLINED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (rfqs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('recentRfqs')}</CardTitle>
          <CardDescription>{t('recentRfqsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t('noRfqsYet')}</p>
            <Link href="/rfq/cart">
              <Button>{t('createFirstRfq')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentRfqs')}</CardTitle>
        <CardDescription>{t('recentRfqsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={getStatusBadgeVariant(rfq.status)}>
                    {tRfq(`status.${rfq.status.toLowerCase()}`)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(rfq.createdAt, locale)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium">
                    {rfq.items.length} {rfq.items.length !== 1 ? t('items') : t('item')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {rfq.items
                      .slice(0, 2)
                      .map((item) => 
                        `${locale === 'ro' ? (item.product.nameRo || item.product.name) : item.product.name} (${formatWeight(item.quantity, locale)})`
                      )
                      .join(', ')}
                    {rfq.items.length > 2 && ` +${rfq.items.length - 2} ${locale === 'ro' ? 'mai multe' : 'more'}`}
                  </p>
                  {rfq.notes && (
                    <p className="text-sm text-muted-foreground italic">
                      "{rfq.notes}"
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {rfq.offers.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {rfq.offers[0].totalAmount.toFixed(2)} lei
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('latestOffer')}
                    </p>
                  </div>
                )}
                
                <Link href={`/rfq/${rfq.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('view')}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/rfq/my-requests">
            <Button variant="outline">{t('viewAllRfqs')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface RFQ {
  id: string;
  status: string;
  createdAt: string;
  notes?: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    companyName: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      nameRo: string | null;
      sku: string;
    };
  }>;
}

export function RecentRFQs() {
  const t = useTranslations('admin.recentRfqs');
  const tRfq = useTranslations('rfq.status');
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const response = await fetch('/api/rfq?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRfqs(data.rfqs);
      }
    } catch (error) {
      console.error('Failed to fetch RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('customer')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('items')}</TableHead>
              <TableHead>{t('created')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs.map((rfq) => (
              <TableRow key={rfq.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{rfq.user.name || rfq.user.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {rfq.user.companyName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(rfq.status)}>
                    {tRfq(rfq.status.toLowerCase())}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {rfq.items.length} {rfq.items.length !== 1 ? t('items') : t('item')}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDateTime(new Date(rfq.createdAt))}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/rfqs/${rfq.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      {t('view')}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-center">
          <Link href="/admin/rfqs">
            <Button variant="outline">{t('viewAll')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}













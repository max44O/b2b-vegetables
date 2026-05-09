'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateTime, formatWeight } from '@/lib/utils';
import { Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
    notes?: string | null;
    product: {
      id: string;
      name: string;
      nameRo: string | null;
      sku: string;
    };
  }>;
  offers: Array<{
    id: string;
    createdAt: string;
    totalAmount: number;
  }>;
}

export function RFQList() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ro';
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const t = useTranslations('rfq');
  const tCommon = useTranslations('common');
  const { toast } = useToast();

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const response = await fetch('/api/rfq');
      if (!response.ok) {
        throw new Error('Failed to fetch RFQs');
      }
      
      const data = await response.json();
      setRfqs(data.rfqs);
    } catch (error) {
      setError(tCommon('rfqLoadFailed'));
      toast({
        title: tCommon('error'),
        description: `${tCommon('rfqLoadFailed')}. ${tCommon('tryAgain')}`,
        variant: "destructive",
      });
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
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">{t('loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchRFQs}>{t('tryAgain')}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rfqs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('noRfqsYet')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('createFirstRfq')}
            </p>
            <Link href="/rfq/cart">
              <Button>{t('create')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('yourQuoteRequests')}</CardTitle>
        <CardDescription>
          Track the status of your requests and manage offers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Latest Offer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs.map((rfq) => (
              <TableRow key={rfq.id}>
                <TableCell className="font-medium">
                  #{rfq.id.slice(-8)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(rfq.status)}>
                    {rfq.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{rfq.items.length} items</p>
                    <p className="text-sm text-muted-foreground">
                      {rfq.items.slice(0, 2).map(item => {
                        const productName = locale === 'ro' ? (item.product.nameRo || item.product.name) : item.product.name;
                        return `${productName} (${item.quantity})`;
                      }).join(', ')}
                      {rfq.items.length > 2 && ` +${rfq.items.length - 2} ${locale === 'ro' ? 'mai multe' : 'more'}`}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDateTime(new Date(rfq.createdAt))}
                </TableCell>
                <TableCell>
                  {rfq.offers.length > 0 ? (
                    <div>
                      <p className="font-medium">
                        €{rfq.offers[0].totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(new Date(rfq.offers[0].createdAt))}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No offers yet</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/rfq/${rfq.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}













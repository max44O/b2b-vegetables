'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, formatWeight, formatCurrency } from '@/lib/utils';
import { ArrowLeft, DollarSign, FileText, User, Building, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface RFQDetailsProps {
  rfq: any;
}

export function RFQDetails({ rfq }: RFQDetailsProps) {
  const t = useTranslations('admin.rfqDetails');
  const tRfq = useTranslations('rfq.status');
  const params = useParams();
  const locale = (params?.locale as string) || 'ro';
  
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/rfqs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToRfqs')}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              RFQ #{rfq.id.slice(-8)}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('created')} {formatDateTime(rfq.createdAt, locale)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(rfq.status)} className="text-lg px-4 py-2">
            {tRfq(rfq.status.toLowerCase())}
          </Badge>
          {rfq.status === 'PENDING' && (
            <Link href={`/admin/rfqs/${rfq.id}/offer`}>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                {t('createOffer')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {t('customerInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('name')}:</span>
              </div>
              <p className="text-lg">{rfq.user.name || 'N/A'}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('company')}:</span>
              </div>
              <p className="text-lg">{rfq.user.companyName || 'N/A'}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('email')}:</span>
              </div>
              <p className="text-lg">{rfq.user.email}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('phone')}:</span>
              </div>
              <p className="text-lg">{rfq.user.phoneNumber || 'N/A'}</p>
            </div>
          </div>
          
          {rfq.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium mb-2">{t('orderNotes')}:</p>
                <p className="text-muted-foreground italic">"{rfq.notes}"</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* RFQ Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {t('orderItems')} ({rfq.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('product')}</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>{t('quantity')}</TableHead>
                <TableHead>{t('notes')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfq.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {locale === 'ro' ? (item.product.nameRo || item.product.name) : item.product.name}
                      </div>
                      {locale === 'ro' && item.product.name && item.product.name !== item.product.nameRo && (
                        <div className="text-sm text-muted-foreground">
                          {item.product.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.product.sku}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {item.product.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatWeight(item.quantity)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.notes ? (
                      <span className="text-sm text-muted-foreground italic">
                        {item.notes}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t('noNotes')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Offers History */}
      {rfq.offers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Offers History ({rfq.offers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rfq.offers.map((offer: any) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(offer.createdAt)}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(Number(offer.total), offer.currency)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  {offer.message && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {offer.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {rfq.status === 'PENDING' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Ready to create an offer?</h3>
                <p className="text-muted-foreground">
                  Review the items and create a quote for this customer.
                </p>
              </div>
              <Link href={`/admin/rfqs/${rfq.id}/offer`}>
                <Button size="lg">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Create Offer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}















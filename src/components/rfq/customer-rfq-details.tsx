'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateTime, formatWeight, formatCurrency } from '@/lib/utils';
import { ArrowLeft, FileText, CheckCircle, XCircle, Download, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface CustomerRFQDetailsProps {
  rfq: any;
}

export function CustomerRFQDetails({ rfq }: CustomerRFQDetailsProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ro';
  const t = useTranslations('rfq');
  const tCommon = useTranslations('common');
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const { toast } = useToast();

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

  const handleAcceptOffer = async () => {
    setIsAccepting(true);
    try {
      const response = await fetch(`/api/rfq/${rfq.id}/accept`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Offer Accepted',
          description: 'You have successfully accepted the offer.',
        });
        window.location.reload();
      } else {
        throw new Error('Failed to accept offer');
      }
    } catch (error) {
      toast({
        title: tCommon('error'),
        description: t('messages.offerAcceptedFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineOffer = async () => {
    setIsDeclining(true);
    try {
      const response = await fetch(`/api/rfq/${rfq.id}/decline`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: t('messages.offerDeclined'),
          description: t('messages.offerDeclined'),
        });
        window.location.reload();
      } else {
        throw new Error('Failed to decline offer');
      }
    } catch (error) {
      toast({
        title: tCommon('error'),
        description: t('messages.offerDeclinedFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsDeclining(false);
    }
  };

  const latestOffer = rfq.offers[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/rfq/my-requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Requests
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              RFQ #{rfq.id.slice(-8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Created {formatDateTime(rfq.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(rfq.status)} className="text-lg px-4 py-2">
          {rfq.status}
        </Badge>
      </div>

      {/* Status Alert */}
      {rfq.status === 'PENDING' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('messages.beingReviewed')}
          </AlertDescription>
        </Alert>
      )}

      {rfq.status === 'OFFERED' && latestOffer && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>New Offer Available!</strong> Review the offer below and accept or decline.
          </AlertDescription>
        </Alert>
      )}

      {/* Requested Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Requested Items ({rfq.items.length})
          </CardTitle>
          {rfq.notes && (
            <CardDescription className="italic">
              "{rfq.notes}"
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Notes</TableHead>
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
                      {locale !== 'ro' && item.product.nameRo && (
                        <div className="text-sm text-muted-foreground">
                          {item.product.nameRo}
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
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Latest Offer */}
      {latestOffer && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Latest Offer
            </CardTitle>
            <CardDescription>
              Received {formatDateTime(latestOffer.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-4xl font-bold text-green-700">
                    {formatCurrency(Number(latestOffer.total), latestOffer.currency)}
                  </p>
                </div>
                {rfq.status === 'OFFERED' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="lg" 
                      onClick={handleAcceptOffer}
                      disabled={isAccepting || isDeclining}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {isAccepting ? 'Accepting...' : 'Accept Offer'}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={handleDeclineOffer}
                      disabled={isAccepting || isDeclining}
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      {isDeclining ? 'Declining...' : 'Decline'}
                    </Button>
                  </div>
                )}
              </div>

              {latestOffer.message && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Message from supplier:</p>
                    <p className="text-muted-foreground">{latestOffer.message}</p>
                  </div>
                </>
              )}

              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send by Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



















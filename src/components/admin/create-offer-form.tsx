'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatWeight, formatCurrency } from '@/lib/utils';
import { DollarSign, Send, ArrowLeft, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadOfferPDF } from '@/lib/pdf-generator';
import Link from 'next/link';

interface CreateOfferFormProps {
  rfq: any;
}

interface OfferLine {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  pricePerKg: number;
  total: number;
  notes?: string;
}

export function CreateOfferForm({ rfq }: CreateOfferFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [offerLines, setOfferLines] = useState<OfferLine[]>(
    rfq.items.map((item: any) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      pricePerKg: 0,
      total: 0,
      notes: item.notes || '',
    }))
  );
  
  const [currency] = useState('EUR');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOffer, setCreatedOffer] = useState<any>(null);

  const updatePrice = (index: number, pricePerKg: number) => {
    setOfferLines(prev => {
      const updated = [...prev];
      updated[index].pricePerKg = pricePerKg;
      updated[index].total = pricePerKg * updated[index].quantity;
      return updated;
    });
  };

  const calculateGrandTotal = () => {
    return offerLines.reduce((sum, line) => sum + line.total, 0);
  };

  const handleSubmit = async () => {
    // Validation
    const hasInvalidPrices = offerLines.some(line => line.pricePerKg <= 0);
    if (hasInvalidPrices) {
      toast({
        title: 'Invalid Prices',
        description: 'Please set prices for all items.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/rfqs/${rfq.id}/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: offerLines,
          currency,
          total: calculateGrandTotal(),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create offer');
      }

      const offerData = await response.json();
      setCreatedOffer(offerData.offer);

      toast({
        title: 'Offer Created',
        description: 'The offer has been sent to the customer.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const grandTotal = calculateGrandTotal();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={`/admin/rfqs/${rfq.id}`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to RFQ Details
        </Button>
      </Link>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{rfq.user.companyName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">{rfq.user.name || rfq.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{rfq.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{rfq.user.phoneNumber || 'N/A'}</p>
            </div>
          </div>
          {rfq.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customer Notes:</p>
                <p className="italic">"{rfq.notes}"</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Set Prices</CardTitle>
          <CardDescription>
            Enter price per kg for each item. Total will be calculated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price per Kg ({currency})</TableHead>
                <TableHead>Total ({currency})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offerLines.map((line, index) => (
                <TableRow key={line.productId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{line.productName}</div>
                      {line.notes && (
                        <div className="text-sm text-muted-foreground italic">
                          Note: {line.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{line.sku}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatWeight(line.quantity)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.pricePerKg || ''}
                      onChange={(e) => updatePrice(index, parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-lg">
                      {formatCurrency(line.total, currency)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-green-50">
                <TableCell colSpan={4} className="text-right font-bold text-lg">
                  Grand Total:
                </TableCell>
                <TableCell>
                  <span className="font-bold text-2xl text-green-700">
                    {formatCurrency(grandTotal, currency)}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message to Customer */}
      <Card>
        <CardHeader>
          <CardTitle>Message to Customer</CardTitle>
          <CardDescription>
            Add any additional information or terms for this offer (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter message to customer (e.g., delivery terms, payment conditions, validity period...)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Summary and Actions */}
      <Card className="border-2 border-green-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Offer Summary</h3>
                <p className="text-muted-foreground">
                  {offerLines.length} items • {rfq.user.companyName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(grandTotal, currency)}
                </p>
              </div>
            </div>

            {grandTotal === 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please set prices for all items before sending the offer.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <div className="flex justify-end space-x-4">
              <Link href={`/admin/rfqs/${rfq.id}`}>
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              
              {createdOffer ? (
                <>
                  <Button 
                    onClick={() => downloadOfferPDF(createdOffer)}
                    variant="outline"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </Button>
                  <Link href={`/admin/rfqs/${rfq.id}`}>
                    <Button size="lg">
                      View RFQ Details
                    </Button>
                  </Link>
                </>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || grandTotal === 0}
                  size="lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Sending Offer...' : 'Send Offer to Customer'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}







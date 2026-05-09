'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatWeight } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  imageUrl?: string;
  quantity: number;
  notes?: string;
}

interface RFQCartProps {
  initialItems: CartItem[];
}

export function RFQCart({ initialItems }: RFQCartProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = useTranslations('rfq');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { toast } = useToast();

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateNotes = (productId: string, notes: string) => {
    setItems(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, notes }
        : item
    ));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast({
        title: t('messages.emptyCart'),
        description: t('messages.emptyCartDescription'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes,
          })),
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RFQ');
      }

      toast({
        title: t('messages.rfqSubmitted'),
        description: t('messages.rfqSubmittedDescription'),
      });

      // Clear cart and redirect
      setItems([]);
      router.push('/rfq/my-requests');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('messages.rfqSubmitFailed'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('emptyCartTitle')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('emptyCartDescription')}
            </p>
            <Button onClick={() => router.push('/products')}>
              {t('browseProducts')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('cartTitle', { count: totalItems })}</CardTitle>
          <CardDescription>
            {t('cartDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tCommon('product')}</TableHead>
                <TableHead>{tCommon('sku')}</TableHead>
                <TableHead>{tCommon('quantity')}</TableHead>
                <TableHead>{t('notes')}</TableHead>
                <TableHead className="w-[100px]">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.sku}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Add notes..."
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(item.productId, e.target.value)}
                      className="min-h-[60px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('notes')}</CardTitle>
          <CardDescription>
            {t('addNotes')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any special requirements, delivery preferences, or other notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.push('/products')}>
          Add More Items
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit RFQ'}
        </Button>
      </div>
    </div>
  );
}


















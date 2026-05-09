'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatWeight } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingCart, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Using regular img tag for better external image support
import Link from 'next/link';

interface CartItem {
  productId: string;
  name?: string;
  sku?: string;
  imageUrl?: string;
  quantity: number;
  notes?: string;
  unit?: string;
  isBeverage?: boolean;
}

export function RFQCartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('rfq-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setItems(cartData);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedItems = items.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    setItems(updatedItems);
    localStorage.setItem('rfq-cart', JSON.stringify(updatedItems));
  };

  const removeItem = (productId: string) => {
    const updatedItems = items.filter(item => item.productId !== productId);
    setItems(updatedItems);
    localStorage.setItem('rfq-cart', JSON.stringify(updatedItems));
  };

  const updateNotes = (productId: string, itemNotes: string) => {
    const updatedItems = items.map(item => 
      item.productId === productId 
        ? { ...item, notes: itemNotes }
        : item
    );
    setItems(updatedItems);
    localStorage.setItem('rfq-cart', JSON.stringify(updatedItems));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before submitting.",
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
        title: "RFQ Submitted",
        description: "Your quote request has been submitted successfully.",
      });

      // Clear cart and redirect
      localStorage.removeItem('rfq-cart');
      setItems([]);
      router.push('/rfq/my-requests');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit RFQ. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading cart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Browse our products and add items to create a quote request.
            </p>
            <Link href="/products">
              <Button>
                Browse Products
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Cart Items</h2>
              <p className="text-muted-foreground">
                {items.length} product{items.length !== 1 ? 's' : ''} • Total: {formatWeight(totalWeight)}
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add More Items
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name || 'Product'}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.cart-image-fallback')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center cart-image-fallback';
                              fallback.innerHTML = '<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.name || 'Product'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.sku || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - (item.isBeverage ? 1 : 10))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                          className="w-24 text-center"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.unit || 'kg'}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + (item.isBeverage ? 1 : 10))}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Add notes for this item..."
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
                      <Trash2 className="h-4 w-4 text-destructive" />
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
          <h3 className="text-xl font-semibold">Additional Information</h3>
          <p className="text-sm text-muted-foreground">
            Add any special requirements, delivery preferences, or other notes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">General Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any special requirements, delivery preferences, or other notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to submit?</h3>
              <p className="text-muted-foreground">
                {items.length} product{items.length !== 1 ? 's' : ''} • Total weight: {formatWeight(totalWeight)}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/products">
                <Button variant="outline" disabled={isSubmitting}>
                  Add More Items
                </Button>
              </Link>
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                <Send className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit RFQ'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




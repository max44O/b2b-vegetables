'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
// Using regular img tag for better external image support
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  nameRo: string | null;
  description: string | null;
  descriptionRo: string | null;
  isActive: boolean;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  nameRo: string | null;
  description?: string | null;
  descriptionRo?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  unit?: string | null;
  category: Category;
}

interface ProductCatalogProps {
  categories: Category[];
  products: Product[];
  locale: string;
  canAddToRFQ?: boolean;
}

export function ProductCatalog({ categories, products, locale, canAddToRFQ }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('products');

  const addToCart = (product: Product, quantity: number) => {
    const newCart = new Map(cart);
    const currentQty = newCart.get(product.id) || 0;
    
    // Check if product is a beverage (unit is 'pcs' or 'piece' or category name contains 'beverage' or 'drink' or 'băuturi')
    const isBeverage = product.unit?.toLowerCase() === 'pcs' || 
                       product.unit?.toLowerCase() === 'piece' ||
                       product.category.nameRo?.toLowerCase().includes('băuturi') ||
                       product.category.nameRo?.toLowerCase().includes('beverage') ||
                       product.category.name?.toLowerCase().includes('beverage') ||
                       product.category.name?.toLowerCase().includes('drink');
    
    // For beverages: quantity is in BAX (which equals quantity in pcs)
    // For other products: quantity is in kg
    const unitLabel = isBeverage ? 'BAX' : 'kg';
    
    newCart.set(product.id, currentQty + quantity);
    setCart(newCart);
    
    toast({
      title: locale === 'ro' ? 'Adăugat în coș' : 'Added to RFQ Cart',
      description: `${locale === 'ro' ? product.nameRo : product.name} ${locale === 'ro' ? 'adăugat' : 'added'} (${quantity} ${unitLabel})`,
    });
  };

  const goToCart = () => {
    // Store cart in localStorage
    const cartData = Array.from(cart.entries()).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      const isBeverage = product?.unit?.toLowerCase() === 'pcs' || 
                         product?.unit?.toLowerCase() === 'piece' ||
                         product?.category.nameRo?.toLowerCase().includes('băuturi') ||
                         product?.category.nameRo?.toLowerCase().includes('beverage') ||
                         product?.category.name?.toLowerCase().includes('beverage') ||
                         product?.category.name?.toLowerCase().includes('drink');
      
      return {
        productId,
        name: locale === 'ro' ? product?.nameRo : product?.name,
        sku: product?.sku,
        imageUrl: product?.imageUrl,
        quantity,
        unit: isBeverage ? 'BAX' : 'kg',
        isBeverage: isBeverage || false,
      };
    });
    
    localStorage.setItem('rfq-cart', JSON.stringify(cartData));
    router.push('/rfq/cart');
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory;
    const matchesSearch = searchTerm === '' || 
              (locale === 'ro' ? (product.nameRo || product.name) : product.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const cartItemCount = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {canAddToRFQ && cart.size > 0 && (
              <Button onClick={goToCart} size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {locale === 'ro' ? 'Coș Cereri' : 'RFQ Cart'} ({cartItemCount} {locale === 'ro' ? 'articole' : 'items'})
              </Button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              {t('all')} ({products.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
              >
                {locale === 'ro' ? category.nameRo : category.name}
                {' '}({products.filter(p => p.category.id === category.id).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('noProducts')}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={locale === 'ro' ? (product.nameRo || product.name) : product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.no-image-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center no-image-fallback';
                          fallback.innerHTML = '<span class="text-gray-400">Fără imagine</span>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">Fără imagine</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">
                    {locale === 'ro' ? (product.nameRo || product.name) : product.name}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {product.sku}
                  </Badge>
                </div>
                
                <Badge variant="outline" className="mb-3">
                  {locale === 'ro' ? product.category.nameRo : product.category.name}
                </Badge>
                
                <CardDescription className="mb-4 line-clamp-2">
                  {locale === 'ro' 
                    ? product.descriptionRo || product.description || 'Premium quality product'
                    : product.description || 'Premium quality product'
                  }
                </CardDescription>
                
                {/* Price Display */}
                {session?.user && session.user.role !== 'PENDING' && product.price ? (
                  <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="space-y-1">
                      <div className="flex items-center justify-end text-sm">
                        <span className="font-semibold text-green-700">
                          {Number(product.price).toFixed(2)} lei {t('priceWithVAT')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        {t('signUpToSeePrices')}
                      </p>
                      <Link href="/auth/register">
                        <Button variant="link" size="sm" className="mt-2 text-green-600">
                          {t('register')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {canAddToRFQ ? (
                  <div className="space-y-2">
                    {cart.has(product.id) ? (
                      <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
                        <p className="text-sm font-medium text-green-700 mb-2">
                          {(() => {
                            const qty = cart.get(product.id) || 0;
                            const isBeverage = product.unit?.toLowerCase() === 'pcs' || 
                                              product.unit?.toLowerCase() === 'piece' ||
                                              product.category.nameRo?.toLowerCase().includes('băuturi') ||
                                              product.category.nameRo?.toLowerCase().includes('beverage') ||
                                              product.category.name?.toLowerCase().includes('beverage') ||
                                              product.category.name?.toLowerCase().includes('drink');
                            const unit = isBeverage ? 'BAX' : 'kg';
                            return locale === 'ro' 
                              ? `În coș: ${qty} ${unit}` 
                              : `In Cart: ${qty} ${unit}`;
                          })()}
                        </p>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 5, 10, 20].map((qty) => {
                        const isBeverage = product.unit?.toLowerCase() === 'pcs' || 
                                          product.unit?.toLowerCase() === 'piece' ||
                                          product.category.nameRo?.toLowerCase().includes('băuturi') ||
                                          product.category.nameRo?.toLowerCase().includes('beverage') ||
                                          product.category.name?.toLowerCase().includes('beverage') ||
                                          product.category.name?.toLowerCase().includes('drink');
                        const unit = isBeverage ? 'BAX' : 'kg';
                        return (
                          <Button
                            key={qty}
                            onClick={() => addToCart(product, qty)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {qty}x
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full h-auto whitespace-normal text-xs sm:text-sm p-2" disabled>
                    {t('loginToRequest')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



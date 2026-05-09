'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Package } from 'lucide-react';
import { Product, Category } from '@prisma/client';
import { formatWeight } from '@/lib/utils';

interface ProductWithCategory extends Product {
  category: Category;
}

interface ProductSearchProps {
  products: ProductWithCategory[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
}

interface SearchFilters {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  sortBy: 'name' | 'price' | 'category' | 'created';
  sortOrder: 'asc' | 'desc';
}

export function ProductSearch({ products, categories, onAddToCart }: ProductSearchProps) {
  const t = useTranslations('products');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: true,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>(products);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = [...products];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.nameRo || '').toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query) ||
        (product.descriptionRo || '').toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.categoryId === filters.category);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price && product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price && product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.isActive);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'category':
          aValue = a.category.name;
          bValue = b.category.name;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: true,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = filters.query || filters.category || filters.minPrice || filters.maxPrice || !filters.inStock;

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name, SKU, or description..."
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(v => v && v !== 'name' && v !== 'asc').length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split('-') as [SearchFilters['sortBy'], SearchFilters['sortOrder']];
                      setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="price-asc">Price Low-High</SelectItem>
                      <SelectItem value="price-desc">Price High-Low</SelectItem>
                      <SelectItem value="category-asc">Category A-Z</SelectItem>
                      <SelectItem value="created-desc">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stock Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStock: !!checked }))}
                    />
                    <label htmlFor="inStock" className="text-sm">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {filteredProducts.length} of {products.length} products
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="outline">{product.sku}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.category.name}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description || 'Premium quality product'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {product.unit || 'kg'} per unit
                  </span>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Available' : 'Out of Stock'}
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => onAddToCart(product)}
                  disabled={!product.isActive}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add to RFQ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Edit, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { formatWeight, formatCurrency } from '@/lib/utils';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  lastUpdated: Date;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface InventoryManagementProps {
  items: InventoryItem[];
  onUpdateStock: (itemId: string, newStock: number, reason: string) => Promise<void>;
  onSetStockLevels: (itemId: string, minLevel: number, maxLevel: number) => Promise<void>;
}

export function InventoryManagement({ items, onUpdateStock, onSetStockLevels }: InventoryManagementProps) {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newStock, setNewStock] = useState('');
  const [reason, setReason] = useState('');
  const [minLevel, setMinLevel] = useState('');
  const [maxLevel, setMaxLevel] = useState('');
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const lowStockItems = items.filter(item => item.status === 'low_stock');
  const outOfStockItems = items.filter(item => item.status === 'out_of_stock');

  const handleStockUpdate = async () => {
    if (!selectedItem || !newStock || !reason) return;

    try {
      await onUpdateStock(selectedItem.id, parseInt(newStock), reason);
      toast({
        title: 'Stock Updated',
        description: `Stock updated for ${selectedItem.productName}`,
      });
      setSelectedItem(null);
      setNewStock('');
      setReason('');
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update stock. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSetStockLevels = async () => {
    if (!selectedItem || !minLevel || !maxLevel) return;

    try {
      await onSetStockLevels(selectedItem.id, parseInt(minLevel), parseInt(maxLevel));
      toast({
        title: 'Stock Levels Updated',
        description: `Stock levels updated for ${selectedItem.productName}`,
      });
      setSelectedItem(null);
      setMinLevel('');
      setMaxLevel('');
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update stock levels. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStockTrend = (item: InventoryItem) => {
    // This would be calculated based on historical data
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage product stock levels</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="space-y-2">
          {outOfStockItems.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {outOfStockItems.length} items are out of stock and need immediate attention.
              </AlertDescription>
            </Alert>
          )}
          {lowStockItems.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {lowStockItems.length} items are running low on stock.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {items.filter(item => item.status === 'in_stock').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Urgent restock needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Level</TableHead>
                <TableHead>Max Level</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.sku}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.currentStock}</TableCell>
                  <TableCell>{item.minStockLevel}</TableCell>
                  <TableCell>{item.maxStockLevel}</TableCell>
                  <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getStockTrend(item)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setNewStock(item.currentStock.toString());
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Stock - {item.productName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="newStock">New Stock Level</Label>
                              <Input
                                id="newStock"
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                placeholder="Enter new stock level"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reason">Reason for Change</Label>
                              <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="restock">Restock</SelectItem>
                                  <SelectItem value="sale">Sale</SelectItem>
                                  <SelectItem value="damage">Damage</SelectItem>
                                  <SelectItem value="adjustment">Adjustment</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleStockUpdate} className="w-full">
                              Update Stock
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setMinLevel(item.minStockLevel.toString());
                              setMaxLevel(item.maxStockLevel.toString());
                            }}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Set Stock Levels - {item.productName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="minLevel">Minimum Stock Level</Label>
                              <Input
                                id="minLevel"
                                type="number"
                                value={minLevel}
                                onChange={(e) => setMinLevel(e.target.value)}
                                placeholder="Enter minimum stock level"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="maxLevel">Maximum Stock Level</Label>
                              <Input
                                id="maxLevel"
                                type="number"
                                value={maxLevel}
                                onChange={(e) => setMaxLevel(e.target.value)}
                                placeholder="Enter maximum stock level"
                              />
                            </div>
                            <Button onClick={handleSetStockLevels} className="w-full">
                              Update Stock Levels
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}













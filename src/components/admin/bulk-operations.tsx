'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Square, Trash2, Edit, Download, AlertTriangle } from 'lucide-react';

interface BulkOperationsProps {
  items: any[];
  onBulkAction: (action: string, itemIds: string[]) => Promise<void>;
  type: 'products' | 'categories' | 'users' | 'rfqs';
}

export function BulkOperations({ items, onBulkAction, type }: BulkOperationsProps) {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) {
      toast({
        title: 'No Action Selected',
        description: 'Please select items and an action.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      await onBulkAction(bulkAction, selectedItems);
      
      toast({
        title: 'Bulk Action Completed',
        description: `${bulkAction} applied to ${selectedItems.length} items.`,
      });

      setSelectedItems([]);
      setBulkAction('');
    } catch (error) {
      toast({
        title: 'Bulk Action Failed',
        description: 'Failed to apply bulk action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAvailableActions = () => {
    switch (type) {
      case 'products':
        return [
          { value: 'activate', label: 'Activate Selected' },
          { value: 'deactivate', label: 'Deactivate Selected' },
          { value: 'delete', label: 'Delete Selected' },
          { value: 'export', label: 'Export Selected' },
        ];
      case 'categories':
        return [
          { value: 'activate', label: 'Activate Selected' },
          { value: 'deactivate', label: 'Deactivate Selected' },
          { value: 'delete', label: 'Delete Selected' },
        ];
      case 'users':
        return [
          { value: 'approve', label: 'Approve Selected' },
          { value: 'reject', label: 'Reject Selected' },
          { value: 'disable', label: 'Disable Selected' },
          { value: 'enable', label: 'Enable Selected' },
        ];
      case 'rfqs':
        return [
          { value: 'mark_reviewed', label: 'Mark as Reviewed' },
          { value: 'export', label: 'Export Selected' },
        ];
      default:
        return [];
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      case 'edit':
        return <Edit className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  const isDestructiveAction = (action: string) => {
    return ['delete', 'reject', 'disable'].includes(action);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.length === items.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedItems.length === items.length ? 'Deselect All' : 'Select All'}
                </span>
              </div>
              
              {selectedItems.length > 0 && (
                <Badge variant="secondary">
                  {selectedItems.length} selected
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose action..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableActions().map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex items-center gap-2">
                        {getActionIcon(action.value)}
                        {action.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedItems.length === 0 || isProcessing}
                variant={isDestructiveAction(bulkAction) ? 'destructive' : 'default'}
                size="sm"
              >
                {isProcessing ? 'Processing...' : 'Apply'}
              </Button>
            </div>
          </div>

          {/* Warning for destructive actions */}
          {bulkAction && isDestructiveAction(bulkAction) && selectedItems.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action will affect {selectedItems.length} items and cannot be undone. 
                Are you sure you want to continue?
              </AlertDescription>
            </Alert>
          )}

          {/* Individual Item Selection */}
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 rounded border hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.name || item.title || item.email || `Item ${item.id}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.sku || item.category?.name || item.companyName || item.status}
                  </div>
                </div>
                <Badge variant={item.isActive !== undefined ? (item.isActive ? 'default' : 'secondary') : 'outline'}>
                  {item.isActive !== undefined ? (item.isActive ? 'Active' : 'Inactive') : item.status || 'Unknown'}
                </Badge>
              </div>
            ))}
          </div>

          {/* Action Summary */}
          {selectedItems.length > 0 && bulkAction && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900">
                Ready to {getAvailableActions().find(a => a.value === bulkAction)?.label.toLowerCase()}
              </div>
              <div className="text-xs text-blue-700">
                This will affect {selectedItems.length} selected items
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}














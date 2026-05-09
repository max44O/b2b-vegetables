'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  nameRo: string | null;
  description: string | null;
  descriptionRo: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
}

interface CategoryManagementProps {
  initialCategories: Category[];
}

export function CategoryManagement({ initialCategories }: CategoryManagementProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameRo: '',
    description: '',
    descriptionRo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      });

      if (response.ok) {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
        ));
        toast({ 
          title: 'Success',
          description: 'Category status updated successfully' 
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update category', 
        variant: 'destructive' 
      });
    }
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        nameRo: category.nameRo || '',
        description: category.description || '',
        descriptionRo: category.descriptionRo || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        nameRo: '',
        description: '',
        descriptionRo: '',
      });
    }
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save failed:', errorData);
        throw new Error(errorData.message || 'Failed to save category');
      }

      const savedCategory = await response.json();
      
      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === savedCategory.id ? savedCategory : c));
        toast({ title: 'Category updated successfully' });
      } else {
        setCategories(prev => [...prev, { ...savedCategory, _count: { products: 0 } }]);
        toast({ title: 'Category created successfully' });
      }

      setCategoryDialogOpen(false);
    } catch (error) {
      console.error('Category save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast({ title: 'Category deleted successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    }
  };

  return (
    <>
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details' : 'Create a new product category'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Name (EN) *</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Vegetables"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nameRo">Name (RO) *</Label>
                <Input
                  id="nameRo"
                  value={categoryForm.nameRo}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameRo: e.target.value })}
                  placeholder="e.g., Legume"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (EN)</Label>
                <Input
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>

              <div>
                <Label htmlFor="descriptionRo">Description (RO)</Label>
                <Input
                  id="descriptionRo"
                  value={categoryForm.descriptionRo}
                  onChange={(e) => setCategoryForm({ ...categoryForm, descriptionRo: e.target.value })}
                  placeholder="Descrierea categoriei"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCategoryDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage product categories ({categories.length} categories)
            </CardDescription>
          </div>
          <Button onClick={() => openCategoryDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    {category.nameRo && (
                      <div className="text-sm text-muted-foreground">{category.nameRo}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {category._count.products} products
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={() => toggleCategoryStatus(category.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openCategoryDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}



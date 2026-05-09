import { prisma } from '@/lib/prisma';
import { ProductManagement } from '@/components/admin/product-management';

export default async function AdminProductsPage() {
  // Authentication is handled by admin layout
  
  // Fetch categories and products
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and categories.
          </p>
        </div>

        <ProductManagement 
          initialCategories={categories}
          initialProducts={products}
        />
      </main>
    </div>
  );
}





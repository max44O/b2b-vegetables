import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { CategoryManagement } from '@/components/admin/category-management';

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-2">
            Manage product categories and their organization.
          </p>
        </div>

        <CategoryManagement initialCategories={categories} />
      </main>
    </div>
  );
}












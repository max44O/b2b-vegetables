import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProductCatalog } from '@/components/products/product-catalog';

export default async function ProductsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  // Redirect pending users to pending page
  if (session.user.role === 'PENDING') {
    redirect(`/${locale}/auth/pending`);
  }

  // Fetch categories and products
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
    orderBy: { name: 'asc' },
  });

  const canAddToRFQ = session?.user && session.user.role !== 'PENDING';

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('products.title')}
              </h1>
              <p className="text-xl text-gray-600">
                Discover our premium selection of vegetables, legumes, and fresh produce.
              </p>
            </div>
          </div>
        </section>

        {/* Products Catalog */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ProductCatalog 
              categories={categories}
              products={products}
              locale={locale}
              canAddToRFQ={canAddToRFQ}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
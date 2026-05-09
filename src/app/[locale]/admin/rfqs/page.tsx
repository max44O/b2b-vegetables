import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminRFQList } from '@/components/admin/admin-rfq-list';

export default async function AdminRFQsPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect if not admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const rfqs = await prisma.rFQ.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      offers: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all customer quote requests.
          </p>
        </div>

        <AdminRFQList initialRfqs={rfqs} />
      </main>
    </div>
  );
}













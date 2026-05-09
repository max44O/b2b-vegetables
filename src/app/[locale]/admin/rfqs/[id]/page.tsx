import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { RFQDetails } from '@/components/admin/rfq-details';

export default async function AdminRFQDetailPage({
  params
}: {
  params: { id: string; locale: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const rfq = await prisma.rFQ.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      offers: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!rfq) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <RFQDetails rfq={rfq} />
      </main>
    </div>
  );
}












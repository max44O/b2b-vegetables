import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CustomerRFQDetails } from '@/components/rfq/customer-rfq-details';

export default async function RFQDetailPage({
  params
}: {
  params: { id: string; locale: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role === 'PENDING') {
    redirect('/auth/pending');
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

  // Check if user owns this RFQ or is admin
  if (session.user.role !== 'ADMIN' && rfq.userId !== session.user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <CustomerRFQDetails rfq={rfq} />
      </main>
    </div>
  );
}













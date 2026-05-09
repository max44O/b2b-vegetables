import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { CreateOfferForm } from '@/components/admin/create-offer-form';

export default async function CreateOfferPage({
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
        take: 1,
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Offer for RFQ #{rfq.id.slice(-8)}
          </h1>
          <p className="text-gray-600 mt-2">
            Set prices for each item and send the offer to {rfq.user.companyName || rfq.user.name}
          </p>
        </div>

        <CreateOfferForm rfq={rfq} />
      </main>
    </div>
  );
}












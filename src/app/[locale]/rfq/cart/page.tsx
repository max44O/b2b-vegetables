import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RFQCartClient } from '@/components/rfq/rfq-cart-client';

export default async function RFQCartPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Redirect PENDING users to pending page
  if (session.user.role === 'PENDING') {
    redirect('/auth/pending');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">RFQ Cart</h1>
          <p className="text-gray-600 mt-2">
            Review your selected products and submit a quote request.
          </p>
        </div>

        <RFQCartClient />
      </main>
    </div>
  );
}

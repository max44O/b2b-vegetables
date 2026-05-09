import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RFQList } from '@/components/rfq/rfq-list';

export default async function MyRequestsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">My RFQs</h1>
          <p className="text-gray-600 mt-2">
            Track your quote requests and manage offers.
          </p>
        </div>

        <RFQList />
      </main>
    </div>
  );
}

















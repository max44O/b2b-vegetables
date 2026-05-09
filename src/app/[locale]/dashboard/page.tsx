import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PendingApprovalBanner } from '@/components/dashboard/pending-approval-banner';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentRFQs } from '@/components/dashboard/recent-rfqs';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Redirect PENDING users to pending page
  if (session.user.role === 'PENDING') {
    redirect('/auth/pending');
  }

  const t = await getTranslations();

  // Fetch dashboard data
  const [rfqStats, recentRfqs] = await Promise.all([
    prisma.rFQ.aggregate({
      where: { userId: session.user.id },
      _count: { id: true },
    }),
    prisma.rFQ.findMany({
      where: { userId: session.user.id },
      include: {
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
      take: 5,
    }),
  ]);

  const pendingRfqs = await prisma.rFQ.count({
    where: {
      userId: session.user.id,
      status: 'PENDING',
    },
  });

  const activeOffers = await prisma.rFQ.count({
    where: {
      userId: session.user.id,
      status: 'OFFERED',
    },
  });

  const completedOrders = await prisma.rFQ.count({
    where: {
      userId: session.user.id,
      status: 'ACCEPTED',
    },
  });

  const stats = {
    totalRfqs: rfqStats._count.id,
    pendingRfqs,
    activeOffers,
    completedOrders,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Pending Approval Banner - This should never show since PENDING users are redirected */}
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome', { name: session.user.name || 'User' })}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent RFQs */}
        <RecentRFQs rfqs={recentRfqs} />
      </main>
    </div>
  );
}

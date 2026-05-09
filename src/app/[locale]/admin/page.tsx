import { AdminStats } from '@/components/admin/admin-stats';
import { RecentUsers } from '@/components/admin/recent-users';
import { RecentRFQs } from '@/components/admin/recent-rfqs';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  const t = await getTranslations('admin');
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('dashboardSubtitle')}
        </p>
      </div>

      <AdminStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <RecentUsers />
        <RecentRFQs />
      </div>
    </>
  );
}





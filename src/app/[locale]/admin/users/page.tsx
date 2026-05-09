import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { UserManagement } from '@/components/admin/user-management';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      vatNumber: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { rfqs: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage user accounts, approvals, and access control.
          </p>
        </div>

        <UserManagement initialUsers={users} />
      </main>
    </div>
  );
}













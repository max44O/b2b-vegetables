import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [totalUsers, pendingUsers, totalRfqs, pendingRfqs] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'PENDING' } }),
      prisma.rFQ.count(),
      prisma.rFQ.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({
      totalUsers,
      pendingUsers,
      totalRfqs,
      pendingRfqs,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching stats' },
      { status: 500 }
    );
  }
}













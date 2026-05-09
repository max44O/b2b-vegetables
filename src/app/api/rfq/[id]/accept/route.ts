import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role === 'PENDING') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rfq = await prisma.rFQ.findUnique({
      where: { id: params.id },
    });

    if (!rfq) {
      return NextResponse.json(
        { message: 'RFQ not found' },
        { status: 404 }
      );
    }

    // Check if user owns this RFQ
    if (session.user.role !== 'ADMIN' && rfq.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if RFQ has an offer
    if (rfq.status !== 'OFFERED') {
      return NextResponse.json(
        { message: 'RFQ does not have an active offer' },
        { status: 400 }
      );
    }

    // Update RFQ status to ACCEPTED
    const updatedRfq = await prisma.rFQ.update({
      where: { id: params.id },
      data: { status: 'ACCEPTED' },
    });

    return NextResponse.json({
      message: 'Offer accepted successfully',
      rfq: updatedRfq,
    });
  } catch (error) {
    console.error('RFQ accept error:', error);
    return NextResponse.json(
      { message: 'An error occurred while accepting the offer' },
      { status: 500 }
    );
  }
}













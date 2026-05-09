import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendUserApprovalEmail } from '@/lib/email';
import { z } from 'zod';

const updateUserSchema = z.object({
  action: z.enum(['approve', 'reject', 'disable', 'enable']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = updateUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'approve':
        if (user.role === 'PENDING') {
          updateData.role = 'CUSTOMER';
        }
        break;
      case 'reject':
        updateData.role = 'PENDING';
        break;
      case 'disable':
        // In a real app, you might want to add an isDisabled field to the schema
        // For now, we'll just change the role
        break;
      case 'enable':
        // Re-enable user
        break;
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    // Send email notification to user about status change
    if (action === 'approve' || action === 'reject') {
      try {
        await sendUserApprovalEmail(
          user.email,
          user.name || user.email,
          action === 'approve'
        );
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('User update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating user' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
        rfqs: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching user' },
      { status: 500 }
    );
  }
}

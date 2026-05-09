import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createRFQSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantityKg: z.number().positive(), // This can be kg or BAX depending on product type
    notes: z.string().optional(),
  })).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role === 'PENDING') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createRFQSchema.parse(body);

    // Create RFQ with items
    const rfq = await prisma.rFQ.create({
      data: {
        userId: session.user.id,
        status: 'PENDING',
        notes: validatedData.notes,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantityKg,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'RFQ created successfully',
      rfq,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('RFQ creation error:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating RFQ' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (session.user.role === 'CUSTOMER') {
      where.userId = session.user.id;
    }
    
    if (status) {
      where.status = status;
    }

    const [rfqs, total] = await Promise.all([
      prisma.rFQ.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              companyName: true,
            },
          },
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rFQ.count({ where }),
    ]);

    return NextResponse.json({
      rfqs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('RFQ fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching RFQs' },
      { status: 500 }
    );
  }
}













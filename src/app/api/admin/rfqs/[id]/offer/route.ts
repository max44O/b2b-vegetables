import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendRFQOfferEmail } from '@/lib/email';
import { z } from 'zod';

const createOfferSchema = z.object({
  lines: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    sku: z.string(),
    quantityKg: z.number(),
    pricePerKg: z.number().positive(),
    total: z.number().positive(),
    notes: z.string().optional(),
  })),
  currency: z.string().default('EUR'),
  total: z.number().positive(),
  message: z.string().optional(),
});

export async function POST(
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
    const validatedData = createOfferSchema.parse(body);

    // Get RFQ
    const rfq = await prisma.rFQ.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    if (!rfq) {
      return NextResponse.json(
        { message: 'RFQ not found' },
        { status: 404 }
      );
    }

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        rfqId: rfq.id,
        adminId: session.user.id,
        totalAmount: validatedData.total,
        notes: validatedData.message,
        status: 'PENDING',
        items: {
          create: validatedData.lines.map(line => ({
            productId: line.productId,
            quantity: line.quantityKg,
            unitPrice: line.pricePerKg,
            totalPrice: line.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update RFQ status to OFFERED
    await prisma.rFQ.update({
      where: { id: params.id },
      data: { status: 'OFFERED' },
    });

    // Send email notification to customer
    try {
      await sendRFQOfferEmail(
        rfq.user.email,
        rfq.user.name || rfq.user.email,
        rfq.id,
        validatedData.total
      );
    } catch (emailError) {
      console.error('Failed to send offer email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'Offer created and sent successfully',
      offer,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Create offer error:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the offer' },
      { status: 500 }
    );
  }
}













import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProductSchema = z.object({
  action: z.enum(['toggle', 'update']),
  name: z.string().optional(),
  nameRo: z.string().optional(),
  description: z.string().optional(),
  descriptionRo: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().optional(),
  unit: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
});

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  nameRo: z.string().optional(),
  description: z.string().optional(),
  descriptionRo: z.string().optional(),
  price: z.number().optional(),
  unit: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
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
    const { action, ...updateData } = updateProductSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    let finalUpdateData: any = {};

    if (action === 'toggle') {
      finalUpdateData.isActive = !product.isActive;
    } else {
      finalUpdateData = updateData;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: finalUpdateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Product update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating product' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Product update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting product' },
      { status: 500 }
    );
  }
}



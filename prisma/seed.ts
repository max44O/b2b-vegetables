import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.local' },
    update: {},
    create: {
      email: 'admin@demo.local',
      password: adminPasswordHash,
      name: 'Admin User',
      companyName: 'Vegetable Wholesale Co.',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create demo customer
  const customerPasswordHash = await bcrypt.hash('Customer123!', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@demo.local' },
    update: {},
    create: {
      email: 'customer@demo.local',
      password: customerPasswordHash,
      name: 'Demo Customer',
      companyName: 'Demo Restaurant Chain',
      vatNumber: 'RO12345678',
      phoneNumber: '+40 123 456 789',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });

  // Create pending user
  const pendingPasswordHash = await bcrypt.hash('Pending123!', 12);
  const pendingUser = await prisma.user.upsert({
    where: { email: 'pending@demo.local' },
    update: {},
    create: {
      email: 'pending@demo.local',
      password: pendingPasswordHash,
      name: 'Pending User',
      companyName: 'New Restaurant',
      role: 'PENDING',
      emailVerified: false,
    },
  });

  console.log('👤 Created users:', { admin: admin.email, customer: customer.email, pending: pendingUser.email });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'cat-vegetables' },
      update: {},
      create: {
        id: 'cat-vegetables',
        name: 'Vegetables',
        nameRo: 'Legume',
        description: 'Fresh vegetables for restaurants',
        descriptionRo: 'Legume proaspete pentru restaurante',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-legumes' },
      update: {},
      create: {
        id: 'cat-legumes',
        name: 'Legumes',
        nameRo: 'Leguminoase',
        description: 'Fresh legumes and beans',
        descriptionRo: 'Leguminoase și fasole proaspătă',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-pulses' },
      update: {},
      create: {
        id: 'cat-pulses',
        name: 'Pulses',
        nameRo: 'Bacale',
        description: 'Dried pulses and grains',
        descriptionRo: 'Bacale și cereale uscate',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-herbs' },
      update: {},
      create: {
        id: 'cat-herbs',
        name: 'Herbs',
        nameRo: 'Ierburi',
        description: 'Fresh herbs and spices',
        descriptionRo: 'Ierburi și condimente proaspete',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-spices' },
      update: {},
      create: {
        id: 'cat-spices',
        name: 'Spices',
        nameRo: 'Condimente',
        description: 'Dried spices and seasonings',
        descriptionRo: 'Condimente și asezonări uscate',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-grains' },
      update: {},
      create: {
        id: 'cat-grains',
        name: 'Grains',
        nameRo: 'Cereale',
        description: 'Rice and other grains',
        descriptionRo: 'Orez și alte cereale',
        isActive: true,
      },
    }),
  ]);

  console.log('📂 Created categories:', categories.length);

  // Create products
  const vegetables = categories.find(c => c.id === 'cat-vegetables')!;
  const legumes = categories.find(c => c.id === 'cat-legumes')!;
  const pulses = categories.find(c => c.id === 'cat-pulses')!;
  const herbs = categories.find(c => c.id === 'cat-herbs')!;
  const spices = categories.find(c => c.id === 'cat-spices')!;
  const grains = categories.find(c => c.id === 'cat-grains')!;

  const products = await Promise.all([
    // Vegetables
    prisma.product.upsert({
      where: { sku: 'VEG-001' },
      update: {},
      create: {
        sku: 'VEG-001',
        name: 'Cherry Tomatoes',
        nameRo: 'Roșii Cherry',
        description: 'Premium cherry tomatoes, packaged in 5kg boxes',
        descriptionRo: 'Roșii cherry, calitate premium, ambalat în cutii de 5kg',
        imageUrl: 'https://via.placeholder.com/400x300/22c55e/ffffff?text=Cherry+Tomatoes',
        price: 3.50,
        unit: 'kg',
        isActive: true,
        categoryId: vegetables.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'VEG-002' },
      update: {},
      create: {
        sku: 'VEG-002',
        name: 'Bell Peppers',
        nameRo: 'Ardei Gras',
        description: 'Red, yellow and green bell peppers, commercial quality',
        descriptionRo: 'Ardei gras roșu, galben și verde, calitate comercială',
        imageUrl: 'https://via.placeholder.com/400x300/16a34a/ffffff?text=Bell+Peppers',
        price: 2.80,
        unit: 'kg',
        isActive: true,
        categoryId: vegetables.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'VEG-003' },
      update: {},
      create: {
        sku: 'VEG-003',
        name: 'Cucumbers',
        nameRo: 'Castraveți',
        description: 'Fresh cucumbers, 15-20cm length, packaged in 10kg crates',
        descriptionRo: 'Castraveți proaspeți, lungime 15-20cm, ambalat în lăzi de 10kg',
        imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop',
        price: 2.20,
        unit: 'kg',
        isActive: true,
        categoryId: vegetables.id,
      },
    }),

    // Legumes
    prisma.product.upsert({
      where: { sku: 'LEG-001' },
      update: {},
      create: {
        sku: 'LEG-001',
        name: 'Green Beans',
        nameRo: 'Fasole Verde',
        description: 'Young green beans, restaurant quality, packaged in 25kg bags',
        descriptionRo: 'Fasole verde tânără, calitate restaurant, ambalat în saci de 25kg',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        price: 4.50,
        unit: 'kg',
        isActive: true,
        categoryId: legumes.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'LEG-002' },
      update: {},
      create: {
        sku: 'LEG-002',
        name: 'Green Peas',
        nameRo: 'Mazăre Verde',
        description: 'Fresh green peas, premium quality',
        descriptionRo: 'Mazăre verde proaspătă, calitate superioară',
        imageUrl: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop',
        price: 5.20,
        unit: 'kg',
        isActive: true,
        categoryId: legumes.id,
      },
    }),

    // Pulses
    prisma.product.upsert({
      where: { sku: 'PUL-001' },
      update: {},
      create: {
        sku: 'PUL-001',
        name: 'Chickpeas',
        nameRo: 'Năut',
        description: 'Dried chickpeas, commercial quality, packaged in 50kg bags',
        descriptionRo: 'Năut uscat, calitate comercială, ambalat în saci de 50kg',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        price: 6.80,
        unit: 'kg',
        isActive: true,
        categoryId: pulses.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PUL-002' },
      update: {},
      create: {
        sku: 'PUL-002',
        name: 'Lentils',
        nameRo: 'Linte',
        description: 'Red and green lentils, premium quality',
        descriptionRo: 'Linte roșie și verde, calitate premium',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        price: 7.50,
        unit: 'kg',
        isActive: true,
        categoryId: pulses.id,
      },
    }),

    // Herbs
    prisma.product.upsert({
      where: { sku: 'HER-001' },
      update: {},
      create: {
        sku: 'HER-001',
        name: 'Parsley',
        nameRo: 'Pătrunjel',
        description: 'Fresh parsley, 100g bunches',
        descriptionRo: 'Pătrunjel proaspăt, mănunchiuri de 100g',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        price: 8.50,
        unit: 'bunch',
        isActive: true,
        categoryId: herbs.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'HER-002' },
      update: {},
      create: {
        sku: 'HER-002',
        name: 'Dill',
        nameRo: 'Mărar',
        description: 'Fresh dill, packaged in 50g bags',
        descriptionRo: 'Mărar proaspăt, ambalat în pungi de 50g',
        imageUrl: 'https://via.placeholder.com/400x300/22c55e/ffffff?text=Dill',
        price: 9.20,
        unit: 'bag',
        isActive: true,
        categoryId: herbs.id,
      },
    }),

    // Spices
    prisma.product.upsert({
      where: { sku: 'SPI-001' },
      update: {},
      create: {
        sku: 'SPI-001',
        name: 'Black Pepper',
        nameRo: 'Piper Negru',
        description: 'Ground black pepper, commercial quality, packaged in 1kg bags',
        descriptionRo: 'Piper negru măcinat, calitate comercială, ambalat în pungi de 1kg',
        imageUrl: 'https://via.placeholder.com/400x300/16a34a/ffffff?text=Black+Pepper',
        price: 15.00,
        unit: 'kg',
        isActive: true,
        categoryId: spices.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SPI-002' },
      update: {},
      create: {
        sku: 'SPI-002',
        name: 'Sea Salt',
        nameRo: 'Sare de Mare',
        description: 'Natural sea salt, fine crystals, packaged in 2kg bags',
        descriptionRo: 'Sare de mare naturală, cristale fine, ambalat în pungi de 2kg',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        price: 3.20,
        unit: 'kg',
        isActive: true,
        categoryId: spices.id,
      },
    }),

    // Grains
    prisma.product.upsert({
      where: { sku: 'GRA-001' },
      update: {},
      create: {
        sku: 'GRA-001',
        name: 'Basmati Rice',
        nameRo: 'Orez Basmati',
        description: 'Premium basmati rice, packaged in 25kg bags',
        descriptionRo: 'Orez basmati premium, ambalat în saci de 25kg',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        price: 4.20,
        unit: 'kg',
        isActive: true,
        categoryId: grains.id,
      },
    }),
  ]);

  console.log('🌾 Created products:', products.length);

  // Create a sample RFQ for the customer
  const sampleRFQ = await prisma.rFQ.create({
    data: {
      userId: customer.id,
      status: 'PENDING',
      notes: 'Urgent order for restaurant opening',
      items: {
        create: [
          {
            productId: products[0].id, // Cherry tomatoes
            quantity: 50,
            unitPrice: 3.50,
            totalPrice: 175.00,
          },
          {
            productId: products[1].id, // Bell peppers
            quantity: 30,
            unitPrice: 2.80,
            totalPrice: 84.00,
          },
          {
            productId: products[6].id, // Chickpeas
            quantity: 100,
            unitPrice: 6.80,
            totalPrice: 680.00,
          },
        ],
      },
    },
  });

  console.log('📝 Created sample RFQ:', sampleRFQ.id);

  console.log('✅ Database seed completed successfully!');
  console.log('\n🔑 Demo accounts:');
  console.log('Admin: admin@demo.local / Admin123!');
  console.log('Customer: customer@demo.local / Customer123!');
  console.log('Pending: pending@demo.local / Pending123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
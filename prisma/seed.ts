import 'dotenv/config';
import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database with demo platform data...');

  // Password hashes
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const ownerPassword = await bcrypt.hash('OwnerPass123!', 10);
  const userPassword = await bcrypt.hash('UserPass123!', 10);

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@platform.com',
      passwordHash: adminPassword,
      address: '100 HQ Boulevard, Suite 500',
      role: 'ADMIN',
    },
  });

  // 2. Create Store Owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@superstore.com' },
    update: {},
    create: {
      name: 'Arthur Pendelton',
      email: 'owner@superstore.com',
      passwordHash: ownerPassword,
      address: '742 Evergreen Terrace, Sector 4',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner@bakery.com' },
    update: {},
    create: {
      name: 'Eleanor Vance',
      email: 'owner@bakery.com',
      passwordHash: ownerPassword,
      address: '12 Baker Street, Downtown',
      role: 'STORE_OWNER',
    },
  });

  // 3. Create Normal Users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@email.com' },
    update: {},
    create: {
      name: 'Johnathan Doe',
      email: 'john.doe@email.com',
      passwordHash: userPassword,
      address: '456 Elm Street, Apt 3B',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah.smith@email.com' },
    update: {},
    create: {
      name: 'Sarah Elizabeth Smith',
      email: 'sarah.smith@email.com',
      passwordHash: userPassword,
      address: '789 Oak Lane, Suite 12',
      role: 'USER',
    },
  });

  // 4. Create Stores
  const store1 = await prisma.store.upsert({
    where: { email: 'contact@superstore.com' },
    update: {},
    create: {
      name: 'Metro Superstore',
      email: 'contact@superstore.com',
      address: '742 Evergreen Terrace, Sector 4',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'info@artisanbakery.com' },
    update: {},
    create: {
      name: 'Artisan Bakery & Cafe',
      email: 'info@artisanbakery.com',
      address: '12 Baker Street, Downtown',
      ownerId: owner2.id,
    },
  });

  // 5. Create Ratings
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store1.id } },
    update: { score: 5 },
    create: {
      userId: user1.id,
      storeId: store1.id,
      score: 5,
    },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store1.id } },
    update: { score: 4 },
    create: {
      userId: user2.id,
      storeId: store1.id,
      score: 4,
    },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store2.id } },
    update: { score: 5 },
    create: {
      userId: user1.id,
      storeId: store2.id,
      score: 5,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('----------------------------------------------------');
  console.log('🔑 Demo Accounts Created:');
  console.log('👑 Admin: admin@platform.com / AdminPass123!');
  console.log('🏪 Store Owner: owner@superstore.com / OwnerPass123!');
  console.log('👥 Normal User: john.doe@email.com / UserPass123!');
  console.log('----------------------------------------------------');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

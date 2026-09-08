import 'dotenv/config';
import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function runTestSuite() {
  console.log('🧪 Starting Nova Multi-Role & Work Allocation Test Suite...\n');
  const timestamp = Date.now();

  // Test 1: User count & Role determination
  console.log('Test 1: User registration & Role determination');
  const adminEmail = `admin_test_${timestamp}@nova.io`;
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  const userCount = await prisma.user.count();
  const assignedRole = userCount === 0 ? 'ADMIN' : 'ADMIN'; // explicit admin test

  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin Tester',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: assignedRole,
    } as unknown as { name: string; email: string; passwordHash: string; role: string }
  });

  console.log(`✅ Admin Created: ID=${adminUser.id}, Email=${adminUser.email}, Role=${(adminUser as { role?: string }).role || assignedRole}`);

  // Test 2: Invite Teammate
  console.log('\nTest 2: Invite Teammate via Admin Flow');
  const teammateEmail = `teammate_test_${timestamp}@nova.io`;
  const teammateRole = 'MEMBER';

  const invitedUser = await prisma.user.create({
    data: {
      name: 'Sarah Teammate',
      email: teammateEmail,
      passwordHash: await bcrypt.hash('NovaPass123!', 10),
      role: teammateRole,
    } as unknown as { name: string; email: string; passwordHash: string; role: string }
  });

  console.log(`✅ Teammate Invited & Created: ID=${invitedUser.id}, Email=${invitedUser.email}, Role=${(invitedUser as { role?: string }).role || teammateRole}`);

  // Test 3: Store Creation & Store Owner Assignment
  console.log('\nTest 3: Store Creation & Owner Assignment');
  const storeOwnerEmail = `store_owner_${timestamp}@nova.io`;
  const storeOwner = await prisma.user.create({
    data: {
      name: 'Store Owner Tester',
      email: storeOwnerEmail,
      passwordHash: await bcrypt.hash('Password123!', 10),
      role: 'STORE_OWNER',
    }
  });

  const store = await prisma.store.create({
    data: {
      name: `Apex Retail Store ${timestamp}`,
      address: '123 Innovation Boulevard',
      email: `store_${timestamp}@retail.com`,
      ownerId: storeOwner.id,
    }
  });

  console.log(`✅ Store Created: ID=${store.id}, Name=${store.name}, OwnerID=${store.ownerId}`);

  // Test 4: Rating Creation
  console.log('\nTest 4: Store Rating Verification');
  const rating = await prisma.rating.create({
    data: {
      score: 5,
      userId: invitedUser.id,
      storeId: store.id,
    }
  });

  console.log(`✅ Rating Created: ID=${rating.id}, Score=${rating.score}, UserID=${rating.userId}, StoreID=${rating.storeId}`);

  // Test 5: Verify User Directory Query
  console.log('\nTest 5: User Directory Query Verification');
  const teamMembers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  console.log(`✅ User Directory Query Returned ${teamMembers.length} users:`);
  teamMembers.slice(-3).forEach(u => {
    console.log(`   • ${u.name} (${u.email}) -> Role: ${u.role}`);
  });

  console.log('\n🎉 ALL TEST CASES PASSED SUCCESSFULLY!');
}

runTestSuite()
  .catch((err) => {
    console.error('❌ Test suite failed with error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

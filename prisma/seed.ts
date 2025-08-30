import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  try {
    // Hash passwords
    const hashedPassword = await bcrypt.hash('admin123!', 12);

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@airavate.com' },
      update: {},
      create: {
        email: 'admin@airavate.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        emailVerified: true,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@airavate.com' },
      update: {},
      create: {
        email: 'test@airavate.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: hashedPassword,
        emailVerified: true,
        role: UserRole.USER,
        isActive: true,
      },
    });

    // Create some audit logs
    await prisma.auditLog.createMany({
      data: [
        {
          userId: adminUser.id,
          action: 'CREATE_USER',
          resource: 'USER',
          details: { message: 'Admin user created during seeding' },
          ipAddress: '127.0.0.1',
        },
        {
          userId: testUser.id,
          action: 'CREATE_USER',
          resource: 'USER',
          details: { message: 'Test user created during seeding' },
          ipAddress: '127.0.0.1',
        },
      ],
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created users:');
    console.log(`   - Admin: ${adminUser.email} (${adminUser.role})`);
    console.log(`   - Test User: ${testUser.email} (${testUser.role})`);
    console.log('📝 Created audit logs for user creation');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding completed successfully');
  })
  .catch((e) => {
    console.error('💥 Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  });
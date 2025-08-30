"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    try {
        const hashedPassword = await bcryptjs_1.default.hash('admin123!', 12);
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
                role: client_1.UserRole.ADMIN,
                isActive: true,
            },
        });
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
                role: client_1.UserRole.USER,
                isActive: true,
            },
        });
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
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map
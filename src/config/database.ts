import { PrismaClient } from '@prisma/client';
import environment from './environment';

const prisma = new PrismaClient({
  log: environment.NODE_ENV === 'development' ? ['query', 'error', 'info', 'warn'] : ['error'],
});

export async function connectToDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database successfully');
    
    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('Disconnected from PostgreSQL database');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await disconnectFromDatabase();
});

export { prisma };
export default prisma;
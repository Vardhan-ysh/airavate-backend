import prisma, { connectToDatabase, disconnectFromDatabase } from './database';
import environment from './environment';

export { 
  prisma, 
  connectToDatabase, 
  disconnectFromDatabase, 
  environment 
};
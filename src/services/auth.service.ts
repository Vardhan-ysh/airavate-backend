import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { User } from '../types/auth.types';

const prisma = new PrismaClient();

export class AuthService {
    async register(email: string, password: string): Promise<User> {
        const hashedPassword = await hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        return user;
    }

    async login(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && await compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async getUserById(userId: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id: userId },
        });
    }
}
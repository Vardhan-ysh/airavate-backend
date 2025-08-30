import { PrismaClient } from '@prisma/client';
import { User } from '../types/user.types';

const prisma = new PrismaClient();

export class UserService {
    async createUser(data: User) {
        return await prisma.user.create({
            data,
        });
    }

    async getUserById(id: number) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: number, data: Partial<User>) {
        return await prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number) {
        return await prisma.user.delete({
            where: { id },
        });
    }

    async getAllUsers() {
        return await prisma.user.findMany();
    }
}
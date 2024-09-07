import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    // Create a new user with isAdmin always false
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword, // Store hashed password
                isAdmin: false, // Ensure isAdmin is always false
            },
        });
    }

    // Retrieve a user by ID
    async getUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    // Retrieve a user by email
    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    // Check if user is an admin
    async isAdmin(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);
        return user?.isAdmin || false;
    }

    // Update a user by ID
    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    // Delete a user by ID
    async deleteUser(id: string): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}

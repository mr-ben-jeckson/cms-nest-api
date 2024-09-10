import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { PaginatedResponse } from '@/interface/paginated.response';

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

    // Limited Users
    async getLimitedUsers(
        page: number = 1,
        limit: number = 10,
        sortField: string = 'createdAt',
        sortDirection: 'asc' | 'desc' = 'desc',
        searchQuery: string | null = ''
    ): Promise<PaginatedResponse<User[]>> {
        const skip = (page - 1) * limit;
        const whereClause: any = {};
        if (searchQuery) {
            whereClause.OR = [
                { name: { contains: searchQuery.toLowerCase() } },
                { email: { contains: searchQuery.toLowerCase() } },
                { phone: { contains: searchQuery.toLowerCase() } },
            ];
        }
        const totalRecords = await this.prisma.user.count({ where: whereClause });
        const users = await this.prisma.user.findMany({
            where: whereClause,
            orderBy: {
                [sortField]: sortDirection,
            },
            skip,
            take: limit,
        });
        const nextPage = page + 1;
        const previousPage = page - 1;
        return {
            data: users,
            current_page: page,
            nextLink: skip + limit < totalRecords ? `${process.env.API_ENDPOINT}/users?page=${nextPage}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&searchQuery=${searchQuery}` : null,
            previousLink: page > 1 ? `${process.env.API_ENDPOINT}/users?page=${previousPage}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&searchQuery=${searchQuery}` : null,
            totalRows: totalRecords,
            per_page: limit,
        };
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

    // Check if phone is already used
    async isPhoneUsed(phone: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: { phone },
        });
        if(user.phone) {
            return true;
        }
        return false;
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

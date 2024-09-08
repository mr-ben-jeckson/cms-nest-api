import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library
import slugify from 'slugify';
import { PaginatedResponse } from '@/interface/paginated.response';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }
    private generateSlug(title: any): string {
        return slugify(title, { lower: true, strict: true });
    }

    async getLimitedPosts(
        page: number = 1,
        limit: number = 10,
        sortField: string = 'createdAt',
        sortDirection: 'asc' | 'desc' = 'desc',
        searchQuery: string | null = ''
    ): Promise< PaginatedResponse<Post[]> > {
        const offset = (page - 1) * limit;

        // Conditional where clause based on searchQuery
        const whereClause = searchQuery
            ? {
                OR: [
                    { title: { contains: searchQuery.toLowerCase() } },  // Convert searchQuery to lowercase if needed
                    { content: { contains: searchQuery.toLowerCase() } },
                ],
            }
            : {};

        // Fetch the total number of posts that match the search query
        const totalRecords = await this.prisma.post.count({
            where: whereClause,
        });

        const posts = await this.prisma.post.findMany({
            where: whereClause,
            orderBy: {
                [sortField]: sortDirection,
            },
            skip: offset,
            take: limit,
        });

        const nextPage = page + 1;
        const previousPage = page - 1;
        const nextLink = offset + limit < totalRecords
            ? `/posts?page=${nextPage}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&searchQuery=${searchQuery}`
            : null;
        const previousLink = page > 1
            ? `/posts?page=${previousPage}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&searchQuery=${searchQuery}`
            : null;
        const totalRows = totalRecords;
        return {
            data: posts,
            current_page: page,
            nextLink,
            previousLink,
            totalRows,
            per_page: limit,
        };
    }

    // Create a new post
    async createPost(data: Prisma.PostCreateInput): Promise<Post> {
        const postId = uuidv4(); // Generate a new UUID
        const slug = this.generateSlug(data.title);
        return this.prisma.post.create({
            data: {
                ...data,
                slug,
                id: postId, // Set the generated UUID as the post ID
            },
        });
    }

    // Retrieve a post by ID
    async getPostById(id: string): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: { id },
        });
    }

    // Retrieve a post by slug
    async getPostBySlug(slug: string): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: { slug },
        });
    }

    // Update an existing post
    async updatePost(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
        const slug = data.title ? this.generateSlug(data.title) : undefined;
        return this.prisma.post.update({
            where: { id },
            data: {
                ...data,
                slug,
            },
        });
    }

    // Soft delete a post by setting `deletedAt` timestamp
    async softDeletePost(id: string): Promise<Post> {
        return this.prisma.post.update({
            where: { id },
            data: {
                deletedAt: new Date(), // Set `deletedAt` to the current timestamp
            },
        });
    }

    // Permanently delete a post
    async deletePost(id: string): Promise<Post> {
        return this.prisma.post.delete({
            where: { id },
        });
    }
}

import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PostSchema } from '../schemas/post/post.schema';
import { ResponseWrapper } from '../ultils/app.wrapper';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { PaginatedResponse } from 'src/interface/paginated.response';

@ApiTags('posts') // Group endpoints under the "posts" tag
@Controller('posts')
@ApiBearerAuth()
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    @ApiOperation({ summary: 'Get limited posts' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Successful retrieval of all limited posts'})
    @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'sortField', type: String, required: false, description: 'Field to sort by' })
    @ApiQuery({ name: 'sortDirection', type: String, required: false, description: 'Sort direction (asc or desc)' })
    @ApiQuery({ name: 'searchQuery', type: String, required: false, description: 'Search query' })
    async getLimitedPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string = 'createdAt',
        @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
        @Query('searchQuery') searchQuery: string = '',
    ): Promise< ResponseWrapper< PaginatedResponse <PostModel[]> >> {
        return new ResponseWrapper(await this.postsService.getLimitedPosts(page, limit, sortField, sortDirection, searchQuery), "Posts", 200);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiResponse({ status: 200, description: 'Successful retrieval of the post', type: PostSchema })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async getPostById(@Param('id') id: string): Promise<PostModel | null> {
        return this.postsService.getPostById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully', type: PostSchema })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async createPost(@Body() postData: Prisma.PostCreateInput): Promise<PostModel> {
        return this.postsService.createPost(postData);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing post' })
    @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostSchema })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async updatePost(@Param('id') id: string, @Body() postData: Prisma.PostUpdateInput): Promise<PostModel> {
        return this.postsService.updatePost(id, postData);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a post by ID' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully', type: PostSchema })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async deletePost(@Param('id') id: string): Promise<PostModel> {
        return this.postsService.deletePost(id);
    }
}

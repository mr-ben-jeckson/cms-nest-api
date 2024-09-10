import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Req, Next, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RegisterSchema } from '@/http/user/register.schema';
import { JwtAuthGuard } from '@/auth/jwt.authguard';
import { AdminGuard } from '@/auth/jwt.adminguard';
import { ResponseWrapper } from '@/ultils/app.wrapper';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseGuards(AdminGuard)
  async createUser(@Body() data: RegisterSchema): Promise<User> {
    return this.userService.createUser(data);
  }

  @ApiOperation({ summary: 'Get limited Users' })
  @ApiResponse({ status: 200, description: 'Users found.' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortField', type: String, required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortDirection', type: String, required: false, description: 'Sort direction (asc or desc)' })
  @ApiQuery({ name: 'searchQuery', type: String, required: false, description: 'Search query' })
  @UseGuards(JwtAuthGuard)
  @Get()
  @UseGuards(AdminGuard)
  async getLimitedUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
    @Query('searchQuery') searchQuery: string = '',
  ) {
    return new ResponseWrapper(await this.userService.getLimitedUsers(Number(page), Number(limit), sortField, sortDirection, searchQuery), "Limited Users", 200);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: { password?: string; name?: string }): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
}

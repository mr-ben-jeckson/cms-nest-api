import { Controller, Post, Get, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus, UseGuards, Query, Put, Param, Delete } from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseWrapper } from '@/ultils/app.wrapper';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserId } from '@/ultils/app.user.decorator';
import { JwtAuthGuard } from '@/auth/jwt.authguard';
import { UserService } from '@/users/users.service';
import { UpdateMedia } from '@/http/media/update.media.shema';

@ApiTags('media')
@Controller('media')
export class MediaController {
    constructor(
        private readonly mediaService: MediaService,
        private readonly userService: UserService
    ) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload a file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File upload',
        type: 'multipart/form-data',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'The file to upload',
                },
                // Add other fields if necessary
            },
            required: ['file'],
        },
    })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Invalid file' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @GetUserId() userId: string) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }
        // Handle file upload and create media entry
        const uploadedData = await this.mediaService.handleFileUpload(file, userId);
        const data = await this.mediaService.createMedia(uploadedData);
        return new ResponseWrapper(data, 'File uploaded successfully', 201);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Successful retrieval of all limited media' })
    @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'sortField', type: String, required: false, description: 'Field to sort by' })
    @ApiQuery({ name: 'sortDirection', type: String, required: false, description: 'Sort direction (asc or desc)' })
    @ApiQuery({ name: 'searchQuery', type: String, required: false, description: 'Search query' })
    async getLimitedMedia(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string = 'createdAt',
        @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
        @Query('searchQuery') searchQuery: string = '',
        @GetUserId() userId: string
    ) {
        const userData = await this.userService.getUserById(userId);
        if(userData && userData.isAdmin) {
            userId = null;
        }
        const data = await this.mediaService.getLimitedMedia(page, limit, sortField, sortDirection, searchQuery, userId || null);
        return new ResponseWrapper(data, "Limited Media", 200);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Successful retrieval of media' })
    @ApiResponse({ status: 404, description: 'Media Not Found' })
    async getMedia(@Param('id') id: string) {
        const data = await this.mediaService.getMediaById(id, null);
        if(!data) {
            throw new HttpException(
                new ResponseWrapper(null, "Media Not Found", HttpStatus.NOT_FOUND).toResponse(),
                HttpStatus.NOT_FOUND
            );
        }
        return new ResponseWrapper(data, "Media", 200);
    }

    // Only Allowed to Change File Name
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, required: true, description: 'Media ID' })
    @ApiBody({ type: UpdateMedia })
    @ApiResponse({ status: 200, description: 'Successful update of media' })
    @ApiResponse({ status: 404, description: 'Media Not Found' })
    async updateMedia(@Body() FormInput: UpdateMedia ,@GetUserId() userId: string, @Param('id') id: string) {
        const dataExist = await this.mediaService.getMediaById(id, null);
        if (!dataExist) {
            throw new HttpException(
                new ResponseWrapper(null, "Media Not Found", HttpStatus.NOT_FOUND).toResponse(),
                HttpStatus.NOT_FOUND
            );
        }
        const userData = await this.userService.getUserById(userId);
        if (userData && userData.isAdmin) {
            const data = await this.mediaService.updateMedia(id, FormInput);
            return new ResponseWrapper(data, "Media Updated", 200);
        }
        const updateData = await this.mediaService.updateMedia(id, FormInput);
        return new ResponseWrapper(updateData, "Media Updated", 200);
    }

    // Delete Media
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, required: true, description: 'Media ID' })
    @ApiResponse({ status: 204, description: 'Success with No Content' })
    @ApiResponse({ status: 404, description: 'Media Not Found' })
    async deleteMedia(@Param('id') id: string, @GetUserId() userId: string) {
        const data = await this.mediaService.getMediaById(id, userId);
        if (!data) {
            throw new HttpException(
                new ResponseWrapper(null, "Media Not Found", HttpStatus.NOT_FOUND).toResponse(),
                HttpStatus.NOT_FOUND
            );
        } else {
            const userData = await this.userService.getUserById(userId);
            if (userData && userData.isAdmin) {
                await this.mediaService.deleteMedia(id);
                return new ResponseWrapper(null, "Media Deleted", HttpStatus.NO_CONTENT);
            }
            await this.mediaService.deleteMedia(id);
            return new ResponseWrapper(null, "Media Deleted", HttpStatus.NO_CONTENT); 
        }
    }

}

import { Controller, Post, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseWrapper } from '@/ultils/app.wrapper';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserId } from '@/ultils/app.user.decorator';
import { JwtAuthGuard } from '@/auth/jwt.authguard';

@ApiTags('media')
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

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
}

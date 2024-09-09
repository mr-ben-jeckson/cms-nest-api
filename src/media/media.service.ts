import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { mkdirSync, existsSync } from 'fs';
import { Media, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import { PaginatedResponse } from '@/interface/paginated.response';
import { UpdateMedia } from '@/http/media/update.media.shema';

@Injectable()
export class MediaService {
    private readonly s3Client: S3Client;
    private readonly storagePath = 'storage/images'; // Local storage path
    private readonly s3Path = process.env.S3_PATH || 'cms-api';

    constructor(
        private readonly prisma: PrismaService
    ) {
        // Configure AWS S3 Client
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1', // Set your region here
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    async handleFileUpload(file: Express.Multer.File, userId: string): Promise<Prisma.MediaCreateInput> {
        const { originalname, mimetype, size } = file;
        const extension = mime.extension(mimetype) || '';
        const filename = path.basename(originalname, `.${extension}`);
        const storage = process.env.STORAGE || 'LOCAL';
        const uniqueId = uuidv4(); // Generate a unique ID
        const uniqueFilename = `${uniqueId}.${extension}`; // Create a unique filename
        const filePath = path.join(this.storagePath, uniqueFilename);

        if (storage == "S3") {
            try {
                // Upload to S3
                const s3Key = `${this.s3Path}/${uniqueFilename}`;
                await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: s3Key,
                        Body: file.buffer,
                        ContentType: mimetype,
                    })
                );
                const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
                return {
                    originalName: uniqueFilename,
                    filename: originalname,
                    mimeType: mimetype,
                    extension,
                    size,
                    storage,
                    url: s3Url,
                    user: { connect: { id: userId } },
                };
            } catch (error) {
                throw new HttpException('Error uploading file to S3', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            // Save file locally
            try {
                if (!existsSync(this.storagePath)) {
                    mkdirSync(this.storagePath, { recursive: true });
                }
                fs.writeFileSync(filePath, file.buffer);
                const localUrl = `http://localhost:3000/${this.storagePath}/${uniqueFilename}`;
                return {
                    originalName: originalname,
                    filename,
                    mimeType: mimetype,
                    extension,
                    size,
                    storage: 'LOCAL',
                    url: localUrl,
                    user: { connect: { id: userId } },
                };
            } catch (error) {
                throw new HttpException('Error saving file locally', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async createMedia(data: Prisma.MediaCreateInput): Promise<Media> {
        const mediaId = uuidv4(); // Generate a new UUID
        return this.prisma.media.create({
            data: {
                ...data,
                id: mediaId, // Set the generated UUID as the media ID
            },
        });
    }

    async getLimitedMedia(
        page: number = 1,
        limit: number = 10,
        sortField: string = 'createdAt',
        sortDirection: 'asc' | 'desc' = 'desc',
        searchQuery: string | null = '',
        userId: string | null = null,
    ): Promise<PaginatedResponse<Media[]>> {
        const offset = (page - 1) * limit;
        const whereClause: any = {};
        if (searchQuery) {
            whereClause.OR = [
                { originalName: { contains: searchQuery.toLowerCase() } },
                { filename: { contains: searchQuery.toLowerCase() } },
            ];
        }
        if (userId) {
            whereClause.userId = userId;
        }
        whereClause.deletedAt = null;
        const totalRecords = await this.prisma.media.count({ where: whereClause });
        const media = await this.prisma.media.findMany({
            where: whereClause,
            orderBy: {
                [sortField]: sortDirection,
            },
            skip: offset,
            take: limit,
        });
        const nextPage = page + 1;
        const previousPage = page - 1;
        return {
            data: media,
            current_page: page,
            nextLink: offset + limit < totalRecords ? `/media?page=${nextPage}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&searchQuery=${searchQuery}` : null,
            previousLink: page > 1 ? `/media?page=${previousPage}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&searchQuery=${searchQuery}` : null,
            totalRows: totalRecords,
            per_page: limit,
        };
    }

    async getMediaById(id: string, userId: string | null): Promise<Media | null> {
        const whereClause: any = {};
        if (userId) {
            whereClause.userId = userId;
        }
        whereClause.id = id;
        whereClause.deletedAt = null;
        return this.prisma.media.findFirst({ where: whereClause });
    }

    async updateMedia(id: string, data: UpdateMedia): Promise<Media> {
        return this.prisma.media.update({
            where: { id },
            data: {
                filename: data.filename,
                updatedAt: new Date()
            },
        });
    }

    async deleteMedia(id: string): Promise<Media> {
        return this.prisma.media.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { mkdirSync, existsSync } from 'fs';
import { Media, Prisma } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

@Injectable()
export class MediaService {
    private readonly s3Client: S3Client;
    private readonly storagePath = 'storage/images'; // Local storage path

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
        const filePath = path.join(this.storagePath, originalname);

        if (storage === 'S3') {
            try {
                // Upload to S3
                const uploadResult = await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: originalname,
                        Body: file.buffer,
                        ContentType: mimetype,
                    })
                );
                const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${originalname}`;
                return {
                    originalName: originalname,
                    filename,
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
                const localUrl = `http://localhost:3000/${this.storagePath}/${originalname}`;
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
}

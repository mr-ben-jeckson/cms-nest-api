import { MediaSchema } from './../schemas/media/media.schema';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

@Injectable()
export class MediaService {
    private readonly s3: S3;
    private readonly storagePath = 'storage/images'; // Local storage path

    constructor() {
        // Configure AWS S3
        this.s3 = new S3({
            region: process.env.AWS_REGION || 'us-east-1', // Set your region here
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    async handleFileUpload(file: Express.Multer.File): Promise<string> {
        const { originalname, mimetype, size } = file;
        const extension = mime.extension(mimetype) || '';
        const filename = path.basename(originalname, `.${extension}`);
        const storage = process.env.STORAGE || 'LOCAL';
        const filePath = path.join(this.storagePath, originalname);

        if (storage === 'S3') {
            try {
                // Upload to S3
                const uploadResult = await this.s3.upload({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: originalname,
                    Body: file.buffer,
                    ContentType: mimetype,
                }).promise();
                return uploadResult.Location; // Return S3 URL
            } catch (error) {
                throw new HttpException('Error uploading file to S3', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            // Save file locally
            try {
                fs.writeFileSync(filePath, file.buffer);
                return `http://localhost:3000/${this.storagePath}/${originalname}`; // Return local URL
            } catch (error) {
                throw new HttpException('Error saving file locally', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

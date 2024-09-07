import { ApiProperty } from '@nestjs/swagger';

export class MediaSchema {
    @ApiProperty({ example: 'example.png', description: 'The original name of the file' })
    originalName?: string;

    @ApiProperty({ example: 'image/png', description: 'The MIME type of the file' })
    mimeType?: string;

    @ApiProperty({ example: 123456, description: 'The size of the file in bytes' })
    size?: number;

    @ApiProperty({ example: 'png', description: 'The file extension' })
    extension?: string;

    @ApiProperty({ example: 'example', description: 'The filename without extension' })
    filename?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class PostSchema {
    @ApiProperty({ description: 'The unique identifier of the post' })
    id: string;

    @ApiProperty({ description: 'The title of the post' })
    title: string;

    @ApiProperty({ description: 'The content of the post' })
    content: string;

    @ApiProperty({ description: 'The slug of the post' })
    slug?: string;

    @ApiProperty({ description: 'Post meta data', type: 'object' })
    meta?: any; // Define a more specific type if needed

    @ApiProperty({ description: 'The publish status of the post' })
    isPublished: boolean;

    @ApiProperty({ description: 'The author ID of the post' })
    authorId: string;

    @ApiProperty({ description: 'The media IDs of the post', type: Array })
    mediaIds: string[];
}

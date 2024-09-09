import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMedia {
    @IsString()
    @ApiProperty({ description: 'File Name can be updated only' })
    filename: string
}
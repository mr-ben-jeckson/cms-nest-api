import { IsString, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BannerSchema {
    @ApiProperty({ description: 'The key of banner' })
    @IsString()
    key?: string;

    @ApiProperty({ description: 'The name of banner' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The object of banner value' })
    @IsString()
    value: string;
}

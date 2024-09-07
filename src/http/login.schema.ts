import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginSchema {
    @ApiProperty({ description: 'The unique email of user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of user' })
    @IsString()
    password: string;
}

import { IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterSchema {
    @ApiProperty({ description: 'The name of user' })
    @IsString()
    name: string; 

    @ApiProperty({ description: 'The mobile number /optional' })
    @IsString()
    phone?: string; 

    @ApiProperty({ description: 'The unique email of user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of user' })
    @IsString()
    password: string;
    
    @ApiProperty({ description: 'allowed only by Admin', default: false })
    @IsBoolean()
    isAdmin?: boolean = false;
}

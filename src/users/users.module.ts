import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminGuard } from '@/auth/jwt.adminguard';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use environment variable for secret key
            signOptions: { expiresIn: '60m' }, // Token expiration time
        }),
    ],
    controllers: [UserController],
    providers: [UserService, PrismaService, AdminGuard ],
    exports: [UserService],
})
export class UserModule { }
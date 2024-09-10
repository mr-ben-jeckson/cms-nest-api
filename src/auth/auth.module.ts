import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { AdminGuard } from './jwt.adminguard';
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use environment variable for secret key
            signOptions: { expiresIn: '60m' }, // Token expiration time
        }),
        PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UserService, AdminGuard],
    exports: [AuthService],
})
export class AuthModule { }

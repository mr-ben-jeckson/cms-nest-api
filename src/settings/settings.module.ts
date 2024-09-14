import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '@/prisma/prisma.service'; // Import PrismaService for database access
import { PrismaModule } from '@/prisma/prisma.module';
import { UserService } from '@/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminGuard } from '@/auth/jwt.adminguard';
import { MediaService } from '@/media/media.service';
@Module({
    imports: [ 
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use environment variable for secret key
            signOptions: { expiresIn: '60m' }, // Token expiration time
        }),
    ],
    controllers: [SettingsController],
    providers: [SettingsService, PrismaService, MediaService, UserService, AdminGuard],
})
export class SettingsModule { }

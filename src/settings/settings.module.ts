import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '@/prisma/prisma.service'; // Import PrismaService for database access
import { PrismaModule } from '@/prisma/prisma.module';
@Module({
    imports: [PrismaModule],
    controllers: [SettingsController],
    providers: [SettingsService, PrismaService],
})
export class SettingsModule { }

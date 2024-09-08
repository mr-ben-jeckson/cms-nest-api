import { UserService } from '@/users/users.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { UserModule } from '@/users/users.route';

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [MediaController],
    providers: [MediaService, UserService],
})
export class MediaModule { }

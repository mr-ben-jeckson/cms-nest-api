import { UserService } from '@/users/users.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [MediaController],
    providers: [MediaService, UserService ],
})
export class MediaModule { }

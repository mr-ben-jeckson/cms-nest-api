import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from '@/auth/auth.module';
import { PostsModule } from '@/posts/posts.module';
import { UserModule } from '@/users/users.module';
import { MediaModule } from '@/media/media.module';
import { SettingsModule } from '@/settings/settings.module';
@Module({
  imports: [AuthModule, PostsModule, UserModule, MediaModule, SettingsModule],
  providers: [PrismaService],
})
export class AppModule {}

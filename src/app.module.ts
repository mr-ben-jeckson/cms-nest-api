import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from '@/auth/auth.module';
import { PostsModule } from '@/posts/posts.module';
import { UserModule } from '@/users/users.module';
import { MediaModule } from '@/media/media.module';
import { StaticFileMiddleware } from './middleware/files.middleware';
@Module({
  imports: [AuthModule, PostsModule, UserModule, MediaModule],
  providers: [PrismaService],
})
export class AppModule {}

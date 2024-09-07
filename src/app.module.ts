import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [AuthModule, PostsModule, UserModule],
  providers: [PrismaService],
})
export class AppModule {}

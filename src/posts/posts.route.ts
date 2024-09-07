import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
    controllers: [PostsController],
    providers: [PostsService, PrismaService],
})
export class PostsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'posts', method: RequestMethod.POST },
                { path: 'posts/:id', method: RequestMethod.PUT },
                { path: 'posts/:id', method: RequestMethod.DELETE }
            );
    }
}

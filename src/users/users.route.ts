import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthMiddleware } from '@/middleware/auth.middleware';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService],
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'users/:id', method: RequestMethod.GET },
                { path: 'users/email/:email', method: RequestMethod.GET },
                { path: 'users/:id', method: RequestMethod.PUT },
                { path: 'users/:id', method: RequestMethod.DELETE },
            );
    }
}
